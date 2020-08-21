import { Hash, CompactInt, ByteArray, Bytes } from 'as-scale-codec';
import { Storage } from './storage';
import { Option, Header } from '@as-substrate/models';
import { Helpers } from './helpers';
import { Log } from './log';

export class System {
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

        const data = Bytes.decodeCompactInt(header);
        Storage.set(Helpers.stringsToU8a(["system", "block_num0"]), header.slice(0, data.decBytes));
        header = header.slice(data.decBytes);

        const stateRoot = header.slice(0, 32);
        header = header.slice(32);

        Storage.set(Helpers.stringsToU8a(["system", "extcs_root"]), header.slice(0, 32));
        header = header.slice(32);

        Storage.set(Helpers.stringsToU8a(["system", "digests_00"]), header);

        // set blockHash, if the block is the first one, populate with default blockHash
        let currentBlockHash: Map<CompactInt, Hash> = new Map<CompactInt, Hash>();
        const blockNumber: CompactInt = new CompactInt(data.value - 1);

        // if(Storage.exists(Helpers.stringsToU8a(["system", "block_hash"]))){
        //     let rawBlockHash = Storage.get(Helpers.stringsToU8a(["system", "block_hash"]));
        //     let blockHashU8a: u8[] = rawBlockHash.isSome() ? (<ByteArray>rawBlockHash.unwrap()).values : [];
        //     Log.printUtf8("block > 0")
        //     currentBlockHash = Helpers.blockHashFromU8Array(blockHashU8a);
        //     currentBlockHash.set(blockNumber, parentHash);
        //     Log.printUtf8("still alive")
        //     Storage.set(Helpers.stringsToU8a(["system", "block_hash"]), Helpers.blockHashToU8a(currentBlockHash));
        // }else{
            currentBlockHash = Helpers.getDefaultBlockHash();
            currentBlockHash.set(blockNumber, parentHash);
            Storage.set(Helpers.stringsToU8a(["system", "block_hash"]), Helpers.blockHashToU8a(currentBlockHash));
        // }
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
        // let blockHash = Storage.get(Helpers.stringsToU8a(["system", "block_hash"]));
        return new Header(parentHash, blockNumber, stateRoot, extrinsicsRoot, digests);
    }
}

