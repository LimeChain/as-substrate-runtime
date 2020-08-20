import { Hash, CompactInt, ScaleString, Bytes } from 'as-scale-codec';
import { Storage } from './storage';
import { Option, Header } from '@as-substrate/models';
import { Helpers } from './helpers';

export enum Phase{
    ApplyExtrinsic = "ApplyExtrinsic",
    Initialization = "Initialization",
    Finalization = "Finalization"
}

export class System {
    // Map of block numbers to block hashes.
    public blockHash: Map<CompactInt, Hash> = Helpers.getDefaultBlockHash();
    // The current block number being processed. Set by `execute_block`.
    public blockNumber: CompactInt;
    // Total extrinsics count for the current block.
    public extrinsicsCount: Option<u32>;
    // Hash of the previous block.
    public parentHash: Hash = Helpers.getPopulatedHash(69);
    // The execution phase of the block
    public executionPhase: Option<Phase>;
    /**
     * Sets up the environment necessary for block production
     * @param header Header instance
     */
    static initialize(header: Header): void{
        Storage.set(Helpers.stringsToU8a(["system", "execution_phase"]), Helpers.stringsToU8a([Phase.Initialization]));
        Storage.set(Helpers.stringsToU8a(["system", "block_number"]), Helpers.stringsToU8a(header.number.toU8a()));
        Storage.set(Helpers.stringsToU8a(["system", "parent_hash"]), header.parentHash.toU8a());
        
        const currentBlockHash: Map<CompactInt, Hash> = Storage.get(Helpers.stringsToU8a(["system", "block_hash"]));
        const blockNumber: CompactInt = new CompactInt(header.blockNumber.value - 1);
        currentBlockHash.set(blockNumber, header.parentHash);
        Storage.set(Helpers.stringsToU8a(["system", "block_hash"]), Helpers.blockHashToU8a(currentBlockHash));
    }
}

