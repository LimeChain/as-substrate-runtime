import { DigestItem, DigestItemType, BaseConsensusItem } from ".";
import { ByteArray } from "as-scale-codec";
import { DecodedData } from "../../codec/decoded-data";
import { Constants } from "../../constants";

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
        assert(input.length > Constants.CONSENSUS_ENGINE_ID_LENGTH, "PreRuntime Digest Item: Input bytes are invalid. EOF");

        const consensusEngineId = input.slice(0, Constants.CONSENSUS_ENGINE_ID_LENGTH);
        input = input.slice(Constants.CONSENSUS_ENGINE_ID_LENGTH);

        const value = ByteArray.fromU8a(input);
        input = input.slice(value.encodedLength());

        return new DecodedData<DigestItem>(new PreRuntime(consensusEngineId, value), input);
    }

    /**
     * Implementation of abstract function.
     * Returns the Digest Item type
     */
    getDigestType(): DigestItemType {
        return DigestItemType.PreRuntime;
    }

}
