import { DigestItem, DigestItemType } from ".";
import { Hash, ByteArray, Byte } from "as-scale-codec";
import { DecodedData } from "../../codec/decoded-data";
import { Utils } from "../../utils";

const CONSENSUS_ENGINE_ID_LENGTH = 4;

/**
 * Class representing Consensus Digest Item into the Substrate Runtime
 */
export class Consensus extends DigestItem {

    /**
     * Digest Item's Consensus Engine ID
     */
    public consensusEngineId: u8[]

    /**
     * Digest Item's bytes payload
     */
    public value: ByteArray

    constructor(consensusEngineId: u8[], value: ByteArray) {
        super(DigestItemType.Consensus);
        assert(consensusEngineId.length == 4, "Consensus Digest Item: Consensus Engine ID is invalid");

        this.consensusEngineId = consensusEngineId;
        this.value = value;
    }

    /**
     * Instanciates Consensus DigestItem from SCALE Encoded Bytes
     */
    static fromU8Array(input: u8[]): DecodedData<DigestItem> {
        assert(input.length > CONSENSUS_ENGINE_ID_LENGTH, "Consensus Digest Item: Input bytes are invalid. EOF");

        const consensusEngineId = input.slice(0, CONSENSUS_ENGINE_ID_LENGTH);
        input = input.slice(CONSENSUS_ENGINE_ID_LENGTH);

        const value = ByteArray.fromU8a(input);
        input = input.slice(value.encodedLength());

        return new DecodedData<DigestItem>(new Consensus(consensusEngineId, value), input);
    }

    /**
     * SCALE Encodes the Consensus DigestItem into u8[]
     */
    toU8a(): u8[] {
        let encoded: u8[] = [<u8>DigestItemType.Consensus];
        return encoded.concat(this.consensusEngineId)
            .concat(this.value.toU8a());
    }

    /**
     * Checks whether the value passed is equal to this instance
     * @param other
     */
    equals(other: Consensus): bool {
        return Utils.areArraysEqual(this.consensusEngineId, other.consensusEngineId) 
            && this.value == other.value;
    }


}
