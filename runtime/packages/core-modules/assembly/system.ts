import { Hash, CompactInt, ByteArray, Bytes } from 'as-scale-codec';
import { Storage } from './storage';
import { Header } from '@as-substrate/models';
import { Helpers } from './helpers';

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
        Storage.set(Helpers.stringsToU8a(["system", "exec_phase"]), Helpers.stringsToU8a([System.INITIALIZATION]));
        const parentHash = Hash.fromU8a(header);
        Storage.set(Helpers.stringsToU8a(["system", "parent_hsh"]), header.slice(0, 32));
        header = header.slice(32);

        const blockNum = Bytes.decodeCompactInt(header);
        Storage.set(Helpers.stringsToU8a(["system", "block_num0"]), header.slice(0, blockNum.decBytes));
        header = header.slice(blockNum.decBytes);

        const _stateRoot = header.slice(0, 32);
        header = header.slice(32);

        Storage.set(Helpers.stringsToU8a(["system", "extcs_root"]), header.slice(0, 32));
        header = header.slice(32);

        Storage.set(Helpers.stringsToU8a(["system", "digests_00"]), header);
        
        // if the BlockHash is populated in the storage, add current one and renew storage
        // Rust version of this implementation is following:
        // <BlockHash<T>>::insert(*number - One::one(), parent_hash);
        const blockNumber: CompactInt = new CompactInt(blockNum.value - 1);

        if(Storage.get(Helpers.stringsToU8a(["system", "block_hash"])).isSome()){
            let rawBlockHash = Storage.get(Helpers.stringsToU8a(["system", "block_hash"]));
            let blockHashU8a: u8[] = (<ByteArray>rawBlockHash.unwrap()).values;
            let currentBlockHash: Map<CompactInt, Hash> = Helpers.blockHashFromU8Array(blockHashU8a);
            currentBlockHash.set(blockNumber, parentHash);
            Storage.set(Helpers.stringsToU8a(["system", "block_hash"]), Helpers.blockHashToU8a(currentBlockHash));
        }else{
            let currentBlockHash: Map<CompactInt, Hash> = Helpers.getDefaultBlockHash();
            currentBlockHash.set(blockNumber, parentHash);
            Storage.set(Helpers.stringsToU8a(["system", "block_hash"]), Helpers.blockHashToU8a(currentBlockHash));
        }
    }
    /**
     * Remove temporary "environment" entries in storage.
     */
    static finalize(): Header {
        Storage.clear(Helpers.stringsToU8a(["system", "execution_phase"]));
        let blockNumber = Storage.take(Helpers.stringsToU8a(["system", "block_number"]));
        let parentHash = Storage.take(Helpers.stringsToU8a(["system", "parent_hash"]));
        let digests = Storage.take(Helpers.stringsToU8a(["system", "digests_00"]));
        let extrinsicsRoot = Storage.take(Helpers.stringsToU8a(["system", "extcs_root"]));
        let stateRoot = Storage.storageRoot();
        return new Header(parentHash, blockNumber, stateRoot, extrinsicsRoot, digests);
    }
}

