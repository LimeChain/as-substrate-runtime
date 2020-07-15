import { DigestItem, DigestItemType } from ".";
import { ByteArray } from "as-scale-codec";
import { Utils } from "../../utils";
import { Constants } from "../../constants";

export abstract class BaseConsensusItem extends DigestItem {

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
        assert(consensusEngineId.length == Constants.CONSENSUS_ENGINE_ID_LENGTH, "Base Consensus Digest Item: Consensus Engine ID is invalid");

        this.consensusEngineId = consensusEngineId;
        this.value = value;
    }

    /**
     * SCALE Encodes the Consensus DigestItem into u8[]
     */
    toU8a(): u8[] {
        let encoded: u8[] = [<u8>this.getDigestType()];
        return encoded.concat(this.consensusEngineId)
            .concat(this.value.toU8a());
    }

    /**
     * Checks whether the value passed is equal to this instance
     * @param other
     */
    equals(other: BaseConsensusItem): bool {
        return Utils.areArraysEqual(this.consensusEngineId, other.consensusEngineId)
            && this.value == other.value;
    }

    abstract getDigestType(): DigestItemType;
}