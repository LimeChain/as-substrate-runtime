import { MockResult } from "./mock-result";
import { Block, Option, Header, Extrinsic, InherentData } from "../models";
import { Hash, CompactInt, UInt64, ByteArray, ScaleString, Byte, BIT_LENGTH } from "as-scale-codec";
import { Signature } from "../models/signature";

/**
 * Namespace used to return SCALE encoded byte inputs and the appropriate native instance of the object
 */
export namespace MockBuilder {

    /**
     * Returns SCALE Encoded Empty Block mock and instance of that block
     */
    export function getEmptyBlockMock(): MockResult<Block> {
        const EMPTY_BLOCK: u8[] = [
            69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69,
            4,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            0,
            0
        ];
        const header = MockHelper._getHeaderInstanceWithoutDigest();
        const block = new Block(header);
        return new MockResult(block, EMPTY_BLOCK);
    }

    /**
     * Returns SCALE Encoded Header Mock and Instance of that Header
     */
    export function getHeaderWithoutDigestMock(): MockResult<Header> {
        const HEADER_WITHOUT_DIGEST: u8[] = [
            69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69,
            4,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            0
        ];

        return new MockResult(MockHelper._getHeaderInstanceWithoutDigest(), HEADER_WITHOUT_DIGEST);
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

    export function getDefaultExtrinsic(): MockResult<Extrinsic> {
        const DEFAULT_EXTRINSIC: u8[] = [
            1, 212, 53, 147, 199, 21, 253, 211, 28, 97, 20, 26, 189, 4, 169, 159, 214, 130, 44, 133, 88, 133, 76, 205, 227, 154, 86, 132, 231, 165, 109, 162,
            125, 142, 175, 4, 21, 22, 135, 115, 99, 38, 201, 254, 161, 126, 37, 252, 82, 135, 97, 54, 147, 201, 18, 144, 156, 178, 38, 170, 71, 148, 242, 106,
            69, 0, 0, 0, 0, 0, 0, 0,
            5, 0, 0, 0, 0, 0, 0, 0,
            72, 43, 234, 45, 159, 200, 43, 162, 117, 34, 73, 0, 41, 24, 219, 106, 202, 41, 220, 128, 114, 102, 33, 40, 235, 200, 34, 98, 249, 135, 134, 116, 39, 94, 159, 122, 148, 102, 158, 5, 178, 195, 144, 165, 149, 149, 118, 250, 97, 192, 228, 0, 216, 37, 219, 207, 7, 240, 82, 75, 243, 191, 237, 138, 0
        ];
        return new MockResult(MockHelper._getExtrinsicInstance(), DEFAULT_EXTRINSIC);
    }

    export function getInvalidExtrinsic(): u8[] {
        // the minimum length of the input should be 144
        const INVALID_EXTRINSIC: u8[] = [
            37, 219, 207, 7, 240, 82, 75, 243, 191, 237, 138, 0
        ];
        return INVALID_EXTRINSIC;
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
        const digest = new Option<Hash>(null);
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
    }
    
    export function _getExtrinsicInstance(): Extrinsic {
        const from = Hash.fromU8a([1, 212, 53, 147, 199, 21, 253, 211, 28, 97, 20, 26, 189, 4, 169, 159, 214, 130, 44, 133, 88, 133, 76, 205, 227, 154, 86, 132, 231, 165, 109, 162]);
        const to  = Hash.fromU8a([125, 142, 175, 4, 21, 22, 135, 115, 99, 38, 201, 254, 161, 126, 37, 252, 82, 135, 97, 54, 147, 201, 18, 144, 156, 178, 38, 170, 71, 148, 242, 106]);
        const amount: UInt64 = new UInt64(69);
        const nonce: UInt64 = new UInt64(5);
        const signature = new Signature([72, 43, 234, 45, 159, 200, 43, 162, 117, 34, 73, 0, 41, 24, 219, 106, 202, 41, 220, 128, 114, 102, 33, 40, 235, 200, 34, 98, 249, 135, 134, 116, 39, 94, 159, 122, 148, 102, 158, 5, 178, 195, 144, 165, 149, 149, 118, 250, 97, 192, 228, 0, 216, 37, 219, 207, 7, 240, 82, 75, 243, 191, 237, 138]);
        return new Extrinsic(from, to, amount, nonce, signature);
    }
}