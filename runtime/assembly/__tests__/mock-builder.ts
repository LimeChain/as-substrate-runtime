import { MockResult } from "./mock-result";
import { Block, Option, Header, Extrinsic, InherentData } from "../models";
import { Hash, CompactInt, UInt64, Bool, ByteArray, ScaleString } from "as-scale-codec";
import { Signature } from "../models";
import { MockConstants } from "./mock-constants";
import { DigestItem, Other, ChangeTrieRoot, Consensus, Seal, PreRuntime } from "../models/digest-items";

/**
 * Namespace used to return SCALE encoded byte inputs and the appropriate native instance of the object
 */
export namespace MockBuilder {

    /**
     * Returns SCALE Encoded Empty Block mock and instance of that block
     */
    export function getEmptyBlockMock(): MockResult<Block> {
        const header = MockHelper._getHeaderInstanceWithoutDigest();
        const block = new Block(header, []);
        return new MockResult(block, MockConstants.EMPTY_BLOCK);
    }

    /**
     * Returns SCALE Encoded Block with extrinsics mock and instance of that block
     */
    export function getBlockWithExtrinsics(): MockResult<Block> {
        const header = MockHelper._getHeaderInstanceWithoutDigest();
        const extrinsic1 = MockHelper._getExtrinsicInstance1();
        const extrinsic2 = MockHelper._getExtrinsicInstance2();
        return new MockResult(new Block(header, [extrinsic1, extrinsic2]), MockConstants.BLOCK_WITH_EXTRINSIC)
    }

    /**
     * Returns SCALE Encoded Block with extrinsics and digests mock and instance of that block
     */
    export function getBlockWithExtrinsicsAndDigests(): MockResult<Block> {
        const header = MockHelper._getHeaderInstanceWithDigests();
        const extrinsic1 = MockHelper._getExtrinsicInstance1();
        const extrinsic2 = MockHelper._getExtrinsicInstance2();
        return new MockResult(new Block(header, [extrinsic1, extrinsic2]), MockConstants.BLOCK_WITH_EXTRINSIC_AND_DIGESTS)
    }

    /**
     * Returns SCALE Encoded Header Mock and Instance of that Header
     */
    export function getHeaderWithoutDigestMock(): MockResult<Header> {
        return new MockResult(MockHelper._getHeaderInstanceWithoutDigest(), MockConstants.HEADER_WITHOUT_DIGEST);
    }

    /**
     * Returns SCALE Encoded Header with Digests Mock and Instance of that Header
     */
    export function getHeaderWithDigestsMock(): MockResult<Header> {
        return new MockResult(MockHelper._getHeaderInstanceWithDigests(), MockConstants.HEADER_WITH_DIGEST);
    }

    /**
     * Returns SCALE encoded Inherent Mock and Instance of that Mock
     */

     export function getInherentMock(): MockResult<InherentData> {
        const DEFAULT_INHERENT: u8[] = [
            16, 
            98, 97, 98, 101, 115, 108, 111, 116, 
            32, 2, 0, 0, 0, 0, 0, 0, 0, 
            102, 105, 110, 97, 108, 110, 117, 109, 
            4, 4, 
            116, 105, 109, 115, 116, 109, 112, 48, 
            32, 1, 0, 0, 0, 0, 0, 0, 0, 
            117, 110, 99, 108, 101, 115, 48, 48, 
            141, 1, 4, 
            69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 
            4, 
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
            0
        ];

        return new MockResult(MockHelper._getEmptyInherentInstance(), DEFAULT_INHERENT);
     }

    /**
     * Returns SCALE encoded extrinsic mock and Instance of that mock
     */
    export function getDefaultExtrinsic(): MockResult<Extrinsic> {
        return new MockResult(MockHelper._getExtrinsicInstance1(), MockConstants.DEFAULT_EXTRINSIC);
    }

    /**
     * Returns invalid SCALE Encoded extrinsic
     */
    export function getInvalidExtrinsic(): u8[] {
        // the minimum length of the input should be 144
        return [
            37, 219, 207, 7, 240, 82, 75, 243, 191, 237, 138, 0
        ];
    }

    /**
     * Returns SCALE Encoded DigestItem with type Option and Instance of that Digest Item
     */
    export function getOtherDigestItemMock(): MockResult<DigestItem> {
        const otherDigestValue = ByteArray.fromU8a([12, 1, 1, 1]);
        return new MockResult(new Other(otherDigestValue), MockConstants.OTHER_DIGEST);
    }

    /**
     * Returns SCALE Encoded ChangeTrieRoot and Instance of that Digest Item
     */
    export function getChangeTrieRootDigestItemMock(): MockResult<DigestItem> {
        const changeTrieRoot = Hash.fromU8a([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]);
        return new MockResult(new ChangeTrieRoot(changeTrieRoot), MockConstants.CHANGE_TRIE_ROOT_DIGEST);
    }

    /**
     * Returns SCALE Encoded Consensus and Instance of that Digest Item
     */
    export function getConsensusDigestItemMock(): MockResult<DigestItem> {
        const consensusEngineId: u8[] = [97, 117, 114, 97];
        const consensusValue = ByteArray.fromU8a([12, 1, 1, 1]); 
        return new MockResult(new Consensus(consensusEngineId, consensusValue), MockConstants.CONSENSUS_DIGEST);
    }

    /**
     * Returns SCALE Encoded Seal and Instance of that Digest Item
     */
    export function getSealDigestItemMock(): MockResult<DigestItem> {
        const consensusEngineId: u8[] = [1, 1, 1, 1];
        const consensusValue = ByteArray.fromU8a([12, 2, 2, 2]);
        return new MockResult(new Seal(consensusEngineId, consensusValue), MockConstants.SEAL_DIGEST);
    }

    /**
     * Returns SCALE Encoded PreRuntime and Instance of that Digest Item
     */
    export function getPreRuntimeDigestItemMock(): MockResult<DigestItem> {
        const consensusEngineId: u8[] = [1, 1, 1, 1];
        const consensusValue = ByteArray.fromU8a([12, 2, 2, 2]);
        return new MockResult(new PreRuntime(consensusEngineId, consensusValue), MockConstants.PRERUNTIME_DIGEST);
    }
}

/**
 * Namesapce containing helper functions for the Mock Builder. Should be used only internally
 */
namespace MockHelper {
    /**
     * Returns a Header instance with a populated parent hash, block number, stateRoot and extrinsics root.
     * Used Internally in the mock builder
     */
    export function _getHeaderInstanceWithoutDigest(): Header {
        const hash69 = Hash.fromU8a([69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69]);
        const hash255 = Hash.fromU8a([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]);
        const blockNumber = new CompactInt(1);
        const digest = new Option<DigestItem[]>(null);
        return new Header(hash69, blockNumber, hash255, hash255, digest);
    }
    /**
     * Returns an InherentData instance 
     * Used internally in the mock builder
     */
    export function _getEmptyInherentInstance(): InherentData {
        const timestamp: UInt64 = new UInt64(1);
        const babeslot: UInt64 = new UInt64(2);
        const finalnum: CompactInt = new CompactInt(1);

        const header1 = _getHeaderInstanceWithoutDigest();
        let headerU8: u8[] = [];
        headerU8 = headerU8.concat((new CompactInt(1)).toU8a());
        headerU8 = headerU8.concat(header1.toU8a());

        __retain(changetype<usize>(header1));

        const data: Map<ScaleString, ByteArray> = new Map<ScaleString, ByteArray>();
        data.set(new ScaleString('babeslot'), new ByteArray(babeslot.toU8a()));
        data.set(new ScaleString('finalnum'),  new ByteArray(finalnum.toU8a()));
        data.set((new ScaleString('timstmp0')),  new ByteArray(timestamp.toU8a()));
        data.set((new ScaleString('uncles00')), new ByteArray(headerU8));
        
        return new InherentData(data);

    /**
     * Returns a Header instance with a populated parent hash, block number, stateRoot, extrinsics root and digests.
     * Used Internally in the mock builder
     */
    export function _getHeaderInstanceWithDigests(): Header {
        const hash69 = Hash.fromU8a([69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69]);
        const hash255 = Hash.fromU8a([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]);
        const blockNumber = new CompactInt(1);

        const digest = new Option<DigestItem[]>(MockHelper._getDigests());
        return new Header(hash69, blockNumber, hash255, hash255, digest);
    }

    export function _getEmptyInherentInstance(): Inherent {
        const timestamp: UInt64 = new UInt64(0);
        const babeslot: UInt64 = new UInt64(0);
        const finalnum: CompactInt = new CompactInt(0);
        const headers: Header[] = [];

        return new Inherent(timestamp, babeslot, finalnum, headers);
    }
    
    export function _getExtrinsicInstance1(): Extrinsic {
        const from = Hash.fromU8a(MockConstants.ALICE_ADDRESS);
        const to  = Hash.fromU8a(MockConstants.BOB_ADDRESS);
        const amount: UInt64 = new UInt64(69);
        const nonce: UInt64 = new UInt64(5);
        const signature = new Signature([72, 43, 234, 45, 159, 200, 43, 162, 117, 34, 73, 0, 41, 24, 219, 106, 202, 41, 220, 128, 114, 102, 33, 40, 235, 200, 34, 98, 249, 135, 134, 116, 39, 94, 159, 122, 148, 102, 158, 5, 178, 195, 144, 165, 149, 149, 118, 250, 97, 192, 228, 0, 216, 37, 219, 207, 7, 240, 82, 75, 243, 191, 237, 138]);
        const exhaustResource = new Bool(false);
        return new Extrinsic(from, to, amount, nonce, signature, exhaustResource);
    }

    export function _getExtrinsicInstance2(): Extrinsic {
        const from = Hash.fromU8a(MockConstants.ALICE_ADDRESS);
        const to = Hash.fromU8a(MockConstants.BOB_ADDRESS);
        const amount: UInt64 = new UInt64(70);
        const nonce: UInt64 = new UInt64(16);
        const signature = new Signature([154, 181, 53, 178, 59, 111, 32, 130, 99, 37, 197, 152, 241, 213, 158, 82, 17, 131, 141, 106, 171, 61, 147, 104, 43, 78, 86, 206, 167, 192, 161, 114, 180, 8, 163, 76, 243, 226, 237, 59, 227, 71, 85, 169, 227, 4, 83, 111, 224, 122, 159, 232, 29, 105, 13, 120, 202, 114, 188, 86, 78, 67, 177, 140]);
        const exhaustResource = new Bool(false);
        return new Extrinsic(from, to, amount, nonce, signature, exhaustResource);
    }

    export function _getDigests(): DigestItem[] {
        const digestsArr = new Array<DigestItem>();
        digestsArr.push(new Other(ByteArray.fromU8a([12, 1, 1, 1])));
        const trieRootValue = Hash.fromU8a([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]);
        digestsArr.push(new ChangeTrieRoot(trieRootValue));
        digestsArr.push(new Consensus([97, 117, 114, 97], ByteArray.fromU8a([12, 1, 1, 1])));
        digestsArr.push(new Seal([1, 1, 1, 1], ByteArray.fromU8a([12, 2, 2, 2])));
        digestsArr.push(new PreRuntime([1, 1, 1, 1], ByteArray.fromU8a([12, 2, 2, 2])));
        return digestsArr;
    }
 }