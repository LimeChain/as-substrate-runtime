import { Hash, CompactInt, ByteArray } from 'as-scale-codec';
import { Storage } from './storage';
import { Option, Header } from '@as-substrate/models';
import { Helpers } from './helpers';

export enum Phase{
    ApplyExtrinsic = "ApplyExtrinsic",
    Initialization = "Initialization",
    Finalization = "Finalization"
}

export class System {
    /**
     * Sets up the environment necessary for block production
     * @param header Header instance
     */
    static initialize(header: Header): void{
        Storage.set(Helpers.stringsToU8a(["system", "exec_phase"]), Helpers.stringsToU8a([Phase.Initialization]));
        Storage.set(Helpers.stringsToU8a(["system", "block_num0"]), Helpers.stringsToU8a(header.number.toU8a()));
        Storage.set(Helpers.stringsToU8a(["system", "parent_hsh"]), header.parentHash.toU8a());
        Storage.set(Helpers.stringsToU8a(["system", "digests_00"]), header.digests);
        Storage.set(Helpers.stringsToU8a(["system", "extcs_root"]), header.extrinsicsRoot);  

        let currentBlockHash: Map<CompactInt, Hash> = new Map<CompactInt, Hash>();
        const blockNumber: CompactInt = new CompactInt(header.blockNumber.value - 1);

        if(header.blockNumber.value != 0){
            let rawBlockHash = Storage.get(Helpers.stringsToU8a(["system", "block_hash"]));
            let blockHashU8a: u8[] = rawBlockHash.isSome() ? (<ByteArray>rawBlockHash.unwrap()).values : [];
            currentBlockHash = Helpers.blockHashFromU8Array(blockHashU8a);
            currentBlockHash.set(blockNumber, header.parentHash);
            Storage.set(Helpers.stringsToU8a(["system", "block_hash"]), Helpers.blockHashToU8a(currentBlockHash));

        }else{
            currentBlockHash = Helpers.getDefaultBlockHash();
            currentBlockHash.set(blockNumber, header.parentHash);
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
        // let blockHash = Storage.get(Helpers.stringsToU8a(["system", "block_hash"]));
        return new Header(parentHash, blockNumber, stateRoot, extrinsicsRoot, digests);
    }
}

