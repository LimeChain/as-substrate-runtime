import { DigestItem, DigestItemType, BaseConsensusItem } from ".";
import { DecodedData } from "..";
import { ByteArray } from "as-scale-codec";

/**
 * Class representing PreRuntime Digest Item into the Substrate Runtime
 */
export class PreRuntime extends BaseConsensusItem {

    constructor(consensusEngineId: u8[], value: ByteArray) {
        super(DigestItemType.PreRuntime, consensusEngineId, value);
    }

    /**
     * Instanciates PreRuntime DigestItem from SCALE Encoded Bytes
     */
    static fromU8Array(input: u8[]): DecodedData<DigestItem> {
        assert(input.length > BaseConsensusItem.CONSENSUS_ENGINE_ID_LENGTH, "PreRuntime Digest Item: Input bytes are invalid. EOF");

        const consensusEngineId = input.slice(0, BaseConsensusItem.CONSENSUS_ENGINE_ID_LENGTH);
        input = input.slice(BaseConsensusItem.CONSENSUS_ENGINE_ID_LENGTH);

        const value = ByteArray.fromU8a(input);
        input = input.slice(value.encodedLength());

        return new DecodedData<DigestItem>(new PreRuntime(consensusEngineId, value), input);
    }

    /**
     * SCALE Encodes the PreRuntime DigestItem into u8[]
     */
    toU8a(): u8[] {
        let encoded: u8[] = [<u8>DigestItemType.PreRuntime];
        return encoded.concat(this.consensusEngineId)
            .concat(this.value.toU8a());
    }

}
