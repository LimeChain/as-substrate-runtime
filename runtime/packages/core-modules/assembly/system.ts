import { Hash, CompactInt, ByteArray, Bytes } from 'as-scale-codec';
import { Storage } from './storage';
import { BlockHash } from '@as-substrate/models';
import { Utils } from '@as-substrate/core-utils';

export class System {
    // execution phases
    static readonly APPLY_EXTRINSIC: string = "ApplyExtrinsic";
    static readonly INITIALIZATION: string = "Initialization";
    static readonly FINALIZATION: string = "Finalization"
    /**
     * Sets up the environment necessary for block production
     * @param header Header instance
     */
    static initialize(header: u8[]): void{
        Storage.set(Utils.stringsToU8a(["system", "exec_phase"]), Utils.stringsToU8a([System.INITIALIZATION]));
        const parentHash = Hash.fromU8a(header);
        Storage.set(Utils.stringsToU8a(["system", "parent_hsh"]), parentHash.toU8a());
        header = header.slice(32);

        const blockNum = Bytes.decodeCompactInt(header);
        Storage.set(Utils.stringsToU8a(["system", "block_num0"]), header.slice(0, blockNum.decBytes));
        header = header.slice(blockNum.decBytes);

        const _stateRoot = header.slice(0, 32);
        header = header.slice(32);

        Storage.set(Utils.stringsToU8a(["system", "extcs_root"]), header.slice(0, 32));
        header = header.slice(32);

        Storage.set(Utils.stringsToU8a(["system", "digests_00"]), header);
        
        // if the BlockHash is populated in the storage, add current one and renew storage
        // Rust version of this implementation is following:
        // <BlockHash<T>>::insert(*number - One::one(), parent_hash);
        const blockNumber: CompactInt = new CompactInt(blockNum.value - 1);

        if(Storage.get(Utils.stringsToU8a(["system", "block_hash"])).isSome()){
            let rawBlockHash = Storage.get(Utils.stringsToU8a(["system", "block_hash"]));
            let blockHashU8a: u8[] = (<ByteArray>rawBlockHash.unwrap()).values;
            let currentBlockHash: BlockHash = BlockHash.fromU8Array(blockHashU8a).result;
            currentBlockHash.insert(blockNumber, parentHash);
            Storage.set(Utils.stringsToU8a(["system", "block_hash"]), currentBlockHash.toU8a());
        }else{
            let currentBlockHash: BlockHash = BlockHash.default();
            currentBlockHash.insert(blockNumber, parentHash);
            Storage.set(Utils.stringsToU8a(["system", "block_hash"]), currentBlockHash.toU8a());
        }
    }
    /**
     * Remove temporary "environment" entries in storage.
     */
    static finalize(): u8[] {
        Storage.clear(Utils.stringsToU8a(["system", "exec_phase"]));
        let blockNumber = Storage.take(Utils.stringsToU8a(["system", "block_num0"]));
        let parentHash = Storage.take(Utils.stringsToU8a(["system", "parent_hsh"]));
        let digests = Storage.take(Utils.stringsToU8a(["system", "digests_00"]));
        let extrinsicsRoot = Storage.take(Utils.stringsToU8a(["system", "extcs_root"]));
        let stateRoot = Storage.storageRoot();

        return parentHash.concat(blockNumber)
            .concat(stateRoot)
            .concat(extrinsicsRoot)
            .concat(digests);
    }
}

