import { CompactInt, ByteArray, Bytes, UInt64, UInt32, Hash } from 'as-scale-codec';
import { Storage } from './storage';
import { Blocks, Header, ExtrinsicData } from '@as-substrate/models';
import { Utils } from '@as-substrate/core-utils';
import { AccountId } from '@as-substrate/balances-module';
import { Crypto } from '.';

export class System {
    // execution phases
    static readonly APPLY_EXTRINSIC: string = "ApplyExtrinsic";
    static readonly INITIALIZATION: string = "Initialization";
    static readonly FINALIZATION: string = "Finalization";
    /**
     * number of all modules in the runtime that creates inherents (timestamp, for now)
     * array is encoded as CompactInt
    */
    static readonly ALL_MODULES: u8[] = [4];
    // nonce key
    static readonly NONCE_KEY: string = "nonce";
    /**
     * Sets up the environment necessary for block production
     * @param header Header instance
    */
    static initialize(header: Header): void{
        Storage.set(Utils.stringsToU8a(["system", "exec_phase"]), Utils.stringsToU8a([System.INITIALIZATION]));
        Storage.set(Utils.stringsToU8a(["system", "parent_hsh"]), header.parentHash.toU8a());
        Storage.set(Utils.stringsToU8a(["system", "block_num0"]), header.number.toU8a());
        Storage.set(Utils.stringsToU8a(["system", "extcs_root"]), header.extrinsicsRoot.toU8a());

        const digestStartIndex: i32 = header.number.encodedLength() + 3*header.parentHash.encodedLength();
        const digests = header.toU8a().slice(digestStartIndex);

        Storage.set(Utils.stringsToU8a(["system", "digests_00"]), digests);
        
        // if the BlockHash is populated in the storage, add current one and renew storage
        // Rust version of this implementation is following:
        // <BlockHash<T>>::insert(*number - One::one(), parent_hash);
        const blockNumber: CompactInt = new CompactInt(header.number.value - 1);

        if(Storage.get(Utils.stringsToU8a(["system", "block_hash"])).isSome()){
            let rawBlocks = Storage.get(Utils.stringsToU8a(["system", "block_hash"]));
            let blocksU8a: u8[] = (<ByteArray>rawBlocks.unwrap()).values;
            let blocks: Blocks = Blocks.fromU8Array(blocksU8a).result;
            blocks.insert(blockNumber, header.parentHash);
            Storage.set(Utils.stringsToU8a(["system", "block_hash"]), blocks.toU8a());
        }else{
            let blocks: Blocks = Blocks.default();
            blocks.insert(blockNumber, header.parentHash);
            Storage.set(Utils.stringsToU8a(["system", "block_hash"]), blocks.toU8a());
        }
    }
    /**
     * Remove temporary "environment" entries in storage.
     */
    static finalize(): Header {
        Storage.clear(Utils.stringsToU8a(["system", "exec_phase"]));
        let blockNumber = Storage.take(Utils.stringsToU8a(["system", "block_num0"]));
        let parentHash = Storage.take(Utils.stringsToU8a(["system", "parent_hsh"]));
        let digests = Storage.take(Utils.stringsToU8a(["system", "digests_00"]));
        let extrinsicsDataU8a = Storage.take(Utils.stringsToU8a(["system", "extcs_data"]));
        const extcsData = ExtrinsicData.fromU8Array(extrinsicsDataU8a).result;
        let extrinsicsRoot = this.extrinsicsRoot(extcsData);
        let stateRoot = Storage.storageRoot();
        let result: u8[] = parentHash.concat(blockNumber)
            .concat(stateRoot)
            .concat(extrinsicsRoot.toU8a())
            .concat(digests);

        const decodedHeader = Header.fromU8Array(result);
        return decodedHeader.result;
    }
    /**
     * Get the nonce value of the given AccountId
     * The format of the key for storing nonce in the storage is:
     * SCALE(AccountId) + SCALE("nonce")
     * @param who account for which to get the nonce
     */
    static accountNonce(who: AccountId): UInt64{
        const nonceKey: u8[] = Utils.stringsToU8a([System.NONCE_KEY]);
        const value = Storage.get(who.getAddress().concat(nonceKey));
        if(value.isSome()){
            const decValue = Bytes.decodeCompactInt((<ByteArray>value.unwrap()).values);
            return new UInt64(decValue.value);
        }
        return new UInt64(0);
    }

    /**
     * Increment nonce of this account
     * @param who account
     */
    static incAccountNonce(who: AccountId): void{
        const oldNonce = System.accountNonce(who);
        const nonceKey: u8[] = Utils.stringsToU8a([System.NONCE_KEY]);
        const newNonce = new UInt64(oldNonce.value + 1);
        Storage.set(who.getAddress().concat(nonceKey), newNonce.toU8a());
    }

    /**
     * Total extrinsics count for the current block.
     * Used as an extrinsic index for extrinsicData map
     */
    static extrinsicCount(): UInt32{
        const extcsCount = Storage.get(Utils.stringsToU8a(["system", "extcs_cout"]));
        if(extcsCount.isSome()){
            return UInt32.fromU8a((<ByteArray>extcsCount.unwrap()).values);
        }
        return new UInt32(0);
    }

    /**
     * Increment extrinsic count
     */
    static incExtrinsicCount(): void {
        const count = this.extrinsicCount();
        const newCount = new UInt32(count.value + 1);
        Storage.set(Utils.stringsToU8a(["system", "extcs_cout"]), newCount.toU8a());
    }

    /**
     * Computes the extrinsicsRoot for the given data
     * @param data 
     */
    static extrinsicsRoot(data: ExtrinsicData): Hash{
        return Crypto.computeExtrinsicRoot(data.toOrderedTrie());
    }

    /**
     * Adds applied extrinsic to the current ExtrinsicData
     * @param ext extrinsic as bytes
     */
    static noteExtrinsic(ext: u8[]): void{
        const extrinsics = Storage.get(Utils.stringsToU8a(["system", "extcs_data"]));
        const extIndex = this.extrinsicCount();
        const extValue = ByteArray.fromU8a(ext);
        if (extrinsics.isSome()){
            let extrinsicsU8a: u8[] = (<ByteArray>extrinsics.unwrap()).values;
            const extcsData = ExtrinsicData.fromU8Array(extrinsicsU8a).result;
            extcsData.insert(extIndex, extValue);
            Storage.set(Utils.stringsToU8a(["system", "extcs_data"]), extcsData.toU8a());
            this.incExtrinsicCount();
            return ;
        }
        const data: Map<UInt32, ByteArray> = new Map();
        data.set(extIndex, extValue);
        const extcsData = new ExtrinsicData(data);
        Storage.set(Utils.stringsToU8a(["system", "extcs_data"]), extcsData.toU8a());
    }
}

