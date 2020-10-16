import { MockResult } from "./mock-result";
import { Hash, CompactInt, UInt64, Bool, ByteArray, UInt128, UInt32 } from "as-scale-codec";
import { 
    Signature, Block, Option, 
    Header, Extrinsic, InherentData, 
    DigestItem, Other, ChangeTrieRoot, 
    Consensus, Seal, PreRuntime,
    SignedTransaction, Inherent,
    ExtrinsicData
} from "@as-substrate/models";
import { AccountData } from "@as-substrate/balances-module";
import { MockConstants } from "./mock-constants";

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
        const extrinsic1 = MockHelper._getSignedTransactionInstance2();
        const extrinsic2 = MockHelper._getSignedTransactionInstance1();
        const extrinsic3 = MockHelper._getInherentInstance();
        return new MockResult(new Block(header, [extrinsic1, extrinsic2, extrinsic3]), MockConstants.BLOCK_WITH_EXTRINSIC)
    }

    /**
     * Returns SCALE Encoded Block with extrinsics and digests mock and instance of that block
     */
    export function getBlockWithExtrinsicsAndDigests(): MockResult<Block> {
        const header = MockHelper._getHeaderInstanceWithDigests();
        const extrinsic1 = MockHelper._getSignedTransactionInstance1();
        const extrinsic2 = MockHelper._getSignedTransactionInstance2();
        const extrinsic3 = MockHelper._getInherentInstance();
        return new MockResult(new Block(header, [extrinsic1, extrinsic2, extrinsic3]), MockConstants.BLOCK_WITH_EXTRINSIC_AND_DIGESTS)
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
    export function getInherentDataMock(): MockResult<InherentData> {
        return new MockResult(MockHelper._getInherentDataInstance(), MockConstants.DEFAULT_INHERENT_DATA);
     }
    /**
     * Returns a map with keys with invalid length
     */
    export function getInvalidDataMap(): Map<string, ByteArray> {
        const data: Map<string, ByteArray> = new Map<string, ByteArray>();
        data.set('isnoteight', new ByteArray([2, 0, 0, 0, 0, 0, 0, 0]));
        data.set('eight', new ByteArray([3, 0, 0, 0, 0, 0, 0, 0]));
        data.set('aiseight', new ByteArray([4, 1, 0, 0, 0, 0, 0, 0]));
        return data;
    }

    /**
     * Returns SCALE encoded extrinsic mock and Instance of that mock
     */
    export function getDefaultExtrinsic(): MockResult<Extrinsic> {
        return new MockResult(MockHelper._getSignedTransactionInstance1(), MockConstants.DEFAULT_SIGNED_TX_INSTANCE);
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
        const changeTrieRoot = MockHelper.getPopulatedHash(255);
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

    /**
     * Returns SCALE Encoded AccountData and Instance of that AccountData
     */
    export function getAccountDataMock(): MockResult <AccountData> {
        const accountDataBytes: u8[] = [ 0x04, 0x04 ];
        const accountData = new AccountData(UInt128.One, UInt128.One);
        return new MockResult(accountData, accountDataBytes);
    }

    /**
     * Returns SCALE Encoded AccountData and Instance of that AccountData
     */
    export function getDefaultAccountDataMock(): MockResult<AccountData> {
        const accountDataBytes: u8[] = [0, 0];
        const accountData = new AccountData(UInt128.Zero, UInt128.Zero);
        return new MockResult(accountData, accountDataBytes);
    }

    export function getExtrinsicDataMock(): MockResult<ExtrinsicData> {
        const extDataBytes: u8[] = MockConstants.EXTRINSIC_DATA;
        const extData = MockHelper._getExtrinsicDataInstance();
        return new MockResult(extData, extDataBytes);
    }
}

/**
 * Namesapce containing helper functions for the Mock Builder. Should be used only internally
 */
export namespace MockHelper {
    /**
     * Returns a Header instance with a populated parent hash, block number, stateRoot and extrinsics root.
     * Used Internally in the mock builder
     */
    export function _getHeaderInstanceWithoutDigest(): Header {
        const hash69 = MockHelper.getPopulatedHash(69);
        const hash255 = MockHelper.getPopulatedHash(255);
        const blockNumber = new CompactInt(1);
        const digest = new Option<DigestItem[]>(null);
        return new Header(hash69, blockNumber, hash255, hash255, digest);
    }

    /**
     * Returns a Header instance with a populated parent hash, block number, stateRoot, extrinsics root and digests.
     * Used Internally in the mock builder
     */
    export function _getHeaderInstanceWithDigests(): Header {
        const hash69 = MockHelper.getPopulatedHash(69);
        const hash255 = MockHelper.getPopulatedHash(255);
        const blockNumber = new CompactInt(1);

        const digest = new Option<DigestItem[]>(MockHelper._getDigests());
        return new Header(hash69, blockNumber, hash255, hash255, digest);
    }
    /**
     * Returns an InherentData instance 
     * Used internally in the mock builder
     */
    export function _getInherentDataInstance(): InherentData {
        const timestamp: UInt64 = new UInt64(1);
        const babeslot: UInt64 = new UInt64(2);
        const finalnum: CompactInt = new CompactInt(1);

        const header1 = _getHeaderInstanceWithoutDigest();
        let headerU8: u8[] = [];
        headerU8 = headerU8.concat((new CompactInt(1)).toU8a());
        headerU8 = headerU8.concat(header1.toU8a());

        const data: Map<string, ByteArray> = new Map<string, ByteArray>();
        data.set('babeslot', new ByteArray(babeslot.toU8a()));
        data.set('finalnum', new ByteArray(finalnum.toU8a()));
        data.set('timstmp0', new ByteArray(timestamp.toU8a()));
        data.set('uncles00', new ByteArray(headerU8));
        
        return new InherentData(data);
    }
    
    export function _getSignedTransactionInstance1(): SignedTransaction {
        const from = Hash.fromU8a(MockConstants.ALICE_ADDRESS);
        const to = Hash.fromU8a(MockConstants.BOB_ADDRESS);
        const amount: UInt64 = new UInt64(69);
        const nonce: UInt64 = new UInt64(5);
        const signature = new Signature([72, 43, 234, 45, 159, 200, 43, 162, 117, 34, 73, 0, 41, 24, 219, 106, 202, 41, 220, 128, 114, 102, 33, 40, 235, 200, 34, 98, 249, 135, 134, 116, 39, 94, 159, 122, 148, 102, 158, 5, 178, 195, 144, 165, 149, 149, 118, 250, 97, 192, 228, 0, 216, 37, 219, 207, 7, 240, 82, 75, 243, 191, 237, 138]);
        const exhaustResource = new Bool(false);
        return new SignedTransaction(from, to, amount, nonce, signature, exhaustResource);
    }

    export function _getSignedTransactionInstance2(): SignedTransaction {
        const from = Hash.fromU8a(MockConstants.ALICE_ADDRESS);
        const to = Hash.fromU8a(MockConstants.BOB_ADDRESS);
        const amount: UInt64 = new UInt64(70);
        const nonce: UInt64 = new UInt64(16);
        const signature = new Signature([154, 181, 53, 178, 59, 111, 32, 130, 99, 37, 197, 152, 241, 213, 158, 82, 17, 131, 141, 106, 171, 61, 147, 104, 43, 78, 86, 206, 167, 192, 161, 114, 180, 8, 163, 76, 243, 226, 237, 59, 227, 71, 85, 169, 227, 4, 83, 111, 224, 122, 159, 232, 29, 105, 13, 120, 202, 114, 188, 86, 78, 67, 177, 140]);
        const exhaustResource = new Bool(false);
        return new SignedTransaction(from, to, amount, nonce, signature, exhaustResource);
    }

    export function _getInherentInstance(): Inherent {
        const callIndex: u8[] = [2, 0];
        const version: u8 = 4;
        const prefix: u8 = 11;
        const argument: UInt64 = new UInt64(100323113);
        return new Inherent(callIndex, version, prefix, argument);
    }

    export function _getDigests(): DigestItem[] {
        const digestsArr = new Array<DigestItem>();
        digestsArr.push(new Other(ByteArray.fromU8a([12, 1, 1, 1])));
        const trieRootValue = MockHelper.getPopulatedHash(255);
        digestsArr.push(new ChangeTrieRoot(trieRootValue));
        digestsArr.push(new Consensus([97, 117, 114, 97], ByteArray.fromU8a([12, 1, 1, 1])));
        digestsArr.push(new Seal([1, 1, 1, 1], ByteArray.fromU8a([12, 2, 2, 2])));
        digestsArr.push(new PreRuntime([1, 1, 1, 1], ByteArray.fromU8a([12, 2, 2, 2])));
        return digestsArr;
    }

    export function getPopulatedHash(byte: u8): Hash {
        const hashBytes: u8[] = new Array<u8>(32);
        hashBytes.fill(byte);
        return Hash.fromU8a(hashBytes);
    }

    export function _getExtrinsicDataInstance(): ExtrinsicData{
        const data: Map<UInt32, ByteArray> = new Map();
        data.set((new UInt32(0)), (ByteArray.fromU8a([40, 4, 2, 0, 11, 41, 207, 250, 5, 0, 0])))
        data.set((new UInt32(1)), (ByteArray.fromU8a(MockConstants.EXT_1)));
        data.set((new UInt32(2)), (ByteArray.fromU8a(MockConstants.EXT_2)));
        return new ExtrinsicData(data);
    }
 }