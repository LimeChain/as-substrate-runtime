import { DigestItem, Other, ChangeTrieRoot, Consensus } from "../models";
import { MockBuilder } from "./mock-builder";
import { Byte, ByteArray, Hash } from "as-scale-codec";
import { Utils } from "../utils";
import { MockConstants } from "./mock-constants";

describe("Digest Item", () => {

    it("should instanciate Other Digest Item", () => {
        const mock = MockBuilder.getOtherDigestItemMock();
        const digestItem = DigestItem.fromU8Array(mock.bytes);
        assert(digestItem.result == mock.expectedObject, "Other Digest Item was not instanciated properly");

        __retain(changetype<usize>(mock));
        __retain(changetype<usize>(digestItem));
    });

    it("Should encode Other Digest Item", () => {
        const other = new Other(ByteArray.fromU8a([12, 1, 1, 1]));
        assert(Utils.areArraysEqual(other.toU8a(), MockConstants.OTHER_DIGEST), "Other Digest was not encoded successfully");

        __retain(changetype<usize>(other));
    });

    it("should instanciate ChangeTrieRoot Digest Item", () => {
        const mock = MockBuilder.getChangeTrieRootDigestItemMock();
        const digestItem = DigestItem.fromU8Array(mock.bytes);
        assert(digestItem.result == mock.expectedObject, "ChangeTrieRoot Digest Item was not instanciated properly");

        __retain(changetype<usize>(mock));
        __retain(changetype<usize>(digestItem));
    });

    it("Should encode ChangeTrieRoot Digest Item", () => {
        const changeTrie = new ChangeTrieRoot(Hash.fromU8a([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]));
        assert(Utils.areArraysEqual(changeTrie.toU8a(), MockConstants.CHANGE_TRIE_ROOT_DIGEST), "ChangeTrieRoot Digest was not encoded successfully");

        __retain(changetype<usize>(changeTrie));
    });

    it("Should instanciate Consensus Digest Item", () => {
        const mock = MockBuilder.getConsensusDigestItemMock();
        const digestItem = DigestItem.fromU8Array(mock.bytes);
        assert(digestItem.result == mock.expectedObject, "Consensus Digest Item was not instanciated properly");

        __retain(changetype<usize>(mock));
        __retain(changetype<usize>(digestItem));
    });

    throws("Should throw when trying to instanciate Consensus with invalid bytes", () => {
        // Should throw because Engine ID must be 4 bytes
        const consensus = new Consensus([1], ByteArray.fromU8a([1, 1, 1, 1]));
    });

    it("Should encode Consensus Digest Item", () => {
        const consensusEngineId: u8[] = [97, 117, 114, 97];
        const consensusValue = ByteArray.fromU8a([12, 1, 1, 1]); 
        const changeTrie = new Consensus(consensusEngineId, consensusValue);
        assert(Utils.areArraysEqual(changeTrie.toU8a(), MockConstants.CONSENSUS_DIGEST), "Consensus Digest was not encoded successfully");

        __retain(changetype<usize>(changeTrie));
    });

    it("Should instanciate Seal Digest Item", () => {

    })

    it("Should instanciate PreRuntime Digest Item", () => {

    })

    it("Should instanciate ChangesTrieSignal Digest Item", () => {

    })

});
