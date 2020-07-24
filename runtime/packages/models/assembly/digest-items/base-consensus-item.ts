import { DigestItem, DigestItemType } from ".";
import { ByteArray } from "as-scale-codec";
import { Utils } from "@as-substrate/core-utils";

export abstract class BaseConsensusItem extends DigestItem {

    /**
     * Number of bytes for the Consensus Engine IDs
     */
    public static readonly CONSENSUS_ENGINE_ID_LENGTH: i32 = 4;

    /**
     * Digest Item's Consensus Engine ID
     */
    public consensusEngineId: u8[]

    /**
     * Digest Item's bytes payload
     */
    public value: ByteArray

    constructor(type: DigestItemType, consensusEngineId: u8[], value: ByteArray) {
        super(type);
        assert(consensusEngineId.length == BaseConsensusItem.CONSENSUS_ENGINE_ID_LENGTH, "Base Consensus Digest Item: Consensus Engine ID is invalid");

        this.consensusEngineId = consensusEngineId;
        this.value = value;
    }

    /**
     * Checks whether the value passed is equal to this instance
     * @param other
     */
    equals(other: BaseConsensusItem): bool {
        return Utils.areArraysEqual(this.consensusEngineId, other.consensusEngineId)
            && this.value == other.value;
    }
}