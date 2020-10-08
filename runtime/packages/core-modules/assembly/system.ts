import { CompactInt, ByteArray, Bytes, UInt64, UInt32, Hash } from 'as-scale-codec';
import { Storage } from './storage';
import { Header, ExtrinsicData } from '@as-substrate/models';
import { Utils, Serialiser } from '@as-substrate/core-utils';
import { AccountId } from '@as-substrate/balances-module';
import { ext_trie_blake2_256_ordered_root_version_1 } from '.';
import { Log } from './log';

export class System {
    // execution phases
    static readonly EXTRINSIC_INDEX: string = ":extrinsic_index";
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
     * Number of block hashes to store in the storage, pruning starts with the oldest block 
    */
    static readonly NUMBER_OF_BLOCKS_TO_KEEP: i32 = 1000;

    /**
     * System storage keys
     */
    // execution phase
    static readonly EXEC_PHASE: string[] = ["system", "exec_phase"];
    // parent hash
    static readonly PARENT_HSH: string[] = ["system", "parent_hsh"];
    // block number
    static readonly BLOCK_NUM0: string[] = ["system", "block_num0"];
    // extrinsics root
    static readonly EXTCS_ROOT: string[] = ["system", "extcs_root"];
    // digest items
    static readonly DIGESTS_00: string[] = ["system", "digests_00"];
    // block hash
    static readonly BLOCK_HASH: string[] = ["system", "block_hash"];
    // extrinsics count
    static readonly EXTCS_COUT: string[] = ["system", "extcs_cout"];
    // extrinsics data 
    static readonly EXTCS_DATA: string[] = ["system", "extcs_data"];
    // block hash count (max number of blocks to be stored)
    static readonly BHSH_COUNT: string[] = ["system", "bhash_cout"];
    
    /**
     * Sets up the environment necessary for block production
     * @param header Header instance
    */
    static initialize(header: Header): void{
        // maximum number of blocks
        const bhshCount = new UInt32(this.NUMBER_OF_BLOCKS_TO_KEEP);
        Storage.set(Utils.stringsToBytes(this.BHSH_COUNT, true), bhshCount.toU8a());
        Storage.set(Utils.stringsToBytes([this.EXTRINSIC_INDEX], true), [<u8>0]);
        Storage.set(Utils.stringsToBytes(this.EXEC_PHASE, true), Utils.stringsToBytes([System.INITIALIZATION], true));
        Storage.set(Utils.stringsToBytes(this.PARENT_HSH, true), header.parentHash.toU8a());
        Storage.set(Utils.stringsToBytes(this.BLOCK_NUM0, true), header.number.toU8a());
        Storage.set(Utils.stringsToBytes(this.EXTCS_ROOT, true), header.extrinsicsRoot.toU8a());

        const digestStartIndex: i32 = header.number.encodedLength() + 3*header.parentHash.encodedLength();
        const digests = header.toU8a().slice(digestStartIndex);

        Storage.set(Utils.stringsToBytes(this.DIGESTS_00, true), digests);
        
        const blockNumber: CompactInt = new CompactInt(header.number.value - 1);
        Log.info("setting " + header.parentHash.toU8a().toString() + " at: " + blockNumber.toString());
        this.setHashAtBlock(blockNumber, header.parentHash);
    }
    /**
     * Remove temporary "environment" entries in storage and finalize block
     */
    static finalize(): Header {
        Storage.clear(Utils.stringsToBytes(this.EXEC_PHASE, true));
        Storage.clear(Utils.stringsToBytes(this.EXTCS_COUT, true));
        let blockNumber = Storage.take(Utils.stringsToBytes(this.BLOCK_NUM0, true));
        let parentHash = Storage.take(Utils.stringsToBytes(this.PARENT_HSH, true));
        let digests = Storage.take(Utils.stringsToBytes(this.DIGESTS_00, true));
        let extrinsicsRoot = Storage.take(Utils.stringsToBytes(this.EXTCS_ROOT, true));
        
        // move block hash pruning window by one block
        let blockHashCount = <u32>(this.blockHashCount().value);
        let blockNum = <u32>(CompactInt.fromU8a(blockNumber).value);
        if(blockNum > blockHashCount){
            let toRemove = blockNum - blockHashCount - 1;
            // keep genesis hash
            if(toRemove != 0){
                let toRemoveNum = new CompactInt(toRemove);
                const blockHashKey = Utils.stringsToBytes(this.BLOCK_HASH, true).concat(toRemoveNum.toU8a());
                Storage.clear(blockHashKey);
            }
        }

        let stateRoot = Storage.storageRoot();

        let result: u8[] = parentHash.concat(blockNumber)
            .concat(stateRoot)
            .concat(extrinsicsRoot)
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
        const nonceKey: u8[] = Utils.stringsToBytes([System.NONCE_KEY], true);
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
        const nonceKey: u8[] = Utils.stringsToBytes([System.NONCE_KEY], true);
        const newNonce = new UInt64(oldNonce.value + 1);
        Storage.set(who.getAddress().concat(nonceKey), newNonce.toU8a());
    }

    /**
    * Maximum number of block number to block hash mappings to keep (oldest pruned first).
    */
    static blockHashCount(): UInt32 {
        const value = Storage.get(Utils.stringsToBytes(this.BHSH_COUNT, true));
        if(value.isSome()){
            const decValue = CompactInt.fromU8a((<ByteArray>value.unwrap()).values);
            return new UInt32(<u32>decValue.value);
        }
        return new UInt32(0);
    }

    /**
     * Gets the index of extrinsic that is currently executing.
     */
    static extrinsicIndex(): UInt32{
        const extIndex = Storage.take(Utils.stringsToBytes([System.EXTRINSIC_INDEX], true));
        return UInt32.fromU8a(extIndex);
    }

    /**
     * Increment extrinsic index
     */
    static incExtrinsicIndex(): void {
        const count = this.extrinsicIndex();
        const newCount = new UInt32(count.value + 1);
        Storage.set(Utils.stringsToBytes([System.EXTRINSIC_INDEX], true), newCount.toU8a());
    }

    /**
     * Computes the extrinsicsRoot for the given data and populates storage
     * @param data 
     */
    static computeExtrinsicsRoot(): void{
        let extrinsicsDataU8a = Storage.take(Utils.stringsToBytes(this.EXTCS_DATA, true));
        const extcsData = ExtrinsicData.fromU8Array(extrinsicsDataU8a).result;
        Storage.set(Utils.stringsToBytes(this.EXEC_PHASE, true), Utils.stringsToBytes([System.APPLY_EXTRINSIC], true));
        const extcsRoot = this.extrinsicsDataRoot(extcsData.toEnumeratedValues());
        Storage.set(Utils.stringsToBytes(this.EXTCS_ROOT, true), extcsRoot.toU8a());
    }

    /**
     * Computes the ordered trie root hash of the extrinsics data
     * @param data enumerated values
     */
    static extrinsicsDataRoot(data: u8[]): Hash{
        let dataPtr = data.dataStart;
        let dataLen = data.length;
        __retain(dataPtr);
        const dataU64 = ((dataLen as u64) << 32) | dataPtr;
        let extrinsicRoot: i32 = ext_trie_blake2_256_ordered_root_version_1(dataU64);
        const hashU8a = Serialiser.deserialiseInput(extrinsicRoot, 32);
        return Hash.fromU8a(hashU8a);
    }
    /**
     * Adds applied extrinsic to the current ExtrinsicData
     * @param ext extrinsic as bytes
     */
    static noteAppliedExtrinsic(ext: u8[]): void{
        const extrinsics = Storage.get(Utils.stringsToBytes(this.EXTCS_DATA, true));
        const extIndex = this.extrinsicIndex();
        const extValue = ByteArray.fromU8a(ext);
        if (extrinsics.isSome()){
            let extrinsicsU8a: u8[] = (<ByteArray>extrinsics.unwrap()).values;
            const extcsData = ExtrinsicData.fromU8Array(extrinsicsU8a).result;
            extcsData.insert(extIndex, extValue);
            Storage.set(Utils.stringsToBytes(this.EXTCS_DATA, true), extcsData.toU8a());
            this.incExtrinsicIndex();
            return ;
        }
        const data: Map<UInt32, ByteArray> = new Map();
        data.set(extIndex, extValue);
        const extcsData = new ExtrinsicData(data);
        Storage.set(Utils.stringsToBytes(this.EXTCS_DATA, true), extcsData.toU8a());
        this.incExtrinsicIndex();
    }

    /**
     * Sets the new extrinsicsCount and set execution phase to finalization
     */
    static noteFinishedExtrinsics(): void{
        let extIndex = this.extrinsicIndex();
        Storage.set(Utils.stringsToBytes(this.EXTCS_COUT, true), extIndex.toU8a());
        Storage.set(Utils.stringsToBytes(this.EXEC_PHASE, true), Utils.stringsToBytes([System.FINALIZATION], true));
    }

    /**
     * Get hash of the block by the block number
     */
    static getHashAtBlock(number: CompactInt): Hash{
        let blockHash = Storage.get(Utils.stringsToBytes(this.BLOCK_HASH, true).concat(number.toU8a()));
        let blockHashU8a: u8[] = blockHash.isSome() ? (<ByteArray>blockHash.unwrap()).values : [];
        return Hash.fromU8a(blockHashU8a);
    }
    static setHashAtBlock(number: CompactInt, hash: Hash): void{
        const blockHashKey: u8[] = Utils.stringsToBytes(this.BLOCK_HASH, true).concat(number.toU8a());
        Storage.set(blockHashKey, hash.toU8a());
    }
}
