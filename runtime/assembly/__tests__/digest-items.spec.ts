import { DigestItem, Other, ChangeTrieRoot, Consensus, Seal, PreRuntime } from "../models";
import { MockBuilder, MockHelper } from "./mock-builder";
import { ByteArray, Hash } from "as-scale-codec";
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
        const changeTrie = new ChangeTrieRoot(MockHelper.getPopulatedHash(255));
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
        const consensus = new Consensus(consensusEngineId, consensusValue);
        assert(Utils.areArraysEqual(consensus.toU8a(), MockConstants.CONSENSUS_DIGEST), "Consensus Digest was not encoded successfully");

        __retain(changetype<usize>(consensus));
    });

    it("Should instanciate Seal Digest Item", () => {
        const mock = MockBuilder.getSealDigestItemMock();
        const digestItem = DigestItem.fromU8Array(mock.bytes);
        assert(digestItem.result == mock.expectedObject, "Seal Digest Item was not instanciated properly");

        __retain(changetype<usize>(mock));
        __retain(changetype<usize>(digestItem));
    })

    throws("Should throw when trying to instanciate Seal with invalid bytes", () => {
        // Should throw because Engine ID must be 4 bytes
        const seal = new Seal([1], ByteArray.fromU8a([1, 1, 1, 1]));
    });

    it("Should encode Seal Digest Item", () => {
        const consensusEngineId: u8[] = [1, 1, 1, 1];
        const consensusValue = ByteArray.fromU8a([12, 2, 2, 2]);
        const seal = new Seal(consensusEngineId, consensusValue);
        assert(Utils.areArraysEqual(seal.toU8a(), MockConstants.SEAL_DIGEST), "Seal Digest was not encoded successfully");

        __retain(changetype<usize>(seal));
    });

    it("Should instanciate PreRuntime Digest Item", () => {
        const mock = MockBuilder.getPreRuntimeDigestItemMock();
        const digestItem = DigestItem.fromU8Array(mock.bytes);
        assert(digestItem.result == mock.expectedObject, "PreRuntime Digest Item was not instanciated properly");

        __retain(changetype<usize>(mock));
        __retain(changetype<usize>(digestItem));
    });

    throws("Should throw when trying to instanciate PreRuntime with invalid bytes", () => {
        // Should throw because Engine ID must be 4 bytes
        const preRuntime = new PreRuntime([1], ByteArray.fromU8a([1, 1, 1, 1]));
    });

    it("Should encode PreRuntime Digest Item", () => {
        const consensusEngineId: u8[] = [1, 1, 1, 1];
        const consensusValue = ByteArray.fromU8a([12, 2, 2, 2]);
        const preRuntime = new PreRuntime(consensusEngineId, consensusValue);
        assert(Utils.areArraysEqual(preRuntime.toU8a(), MockConstants.PRERUNTIME_DIGEST), "Seal Digest was not encoded successfully");

        __retain(changetype<usize>(preRuntime));
    });

});
