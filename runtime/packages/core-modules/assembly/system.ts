import { CompactInt, ByteArray } from 'as-scale-codec';
import { Storage } from './storage';
import { Blocks, Header } from '@as-substrate/models';
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
            let rawBlockHash = Storage.get(Utils.stringsToU8a(["system", "block_hash"]));
            let blockHashU8a: u8[] = (<ByteArray>rawBlockHash.unwrap()).values;
            let currentBlockHash: Blocks = Blocks.fromU8Array(blockHashU8a).result;
            currentBlockHash.insert(blockNumber, header.parentHash);
            Storage.set(Utils.stringsToU8a(["system", "block_hash"]), currentBlockHash.toU8a());
        }else{
            let currentBlockHash: Blocks = Blocks.default();
            currentBlockHash.insert(blockNumber, header.parentHash);
            Storage.set(Utils.stringsToU8a(["system", "block_hash"]), currentBlockHash.toU8a());
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
        let extrinsicsRoot = Storage.take(Utils.stringsToU8a(["system", "extcs_root"]));
        let stateRoot = Storage.storageRoot();

        let result: u8[] = parentHash.concat(blockNumber)
            .concat(stateRoot)
            .concat(extrinsicsRoot)
            .concat(digests);

        const decodedHeader = Header.fromU8Array(result);
        return decodedHeader.result;
    }
}

