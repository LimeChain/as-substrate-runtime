import { Hash, ByteArray, Bytes, CompactInt } from "as-scale-codec";
import { Header, Extrinsic, Option, DecodedData, IHeader, IExtrinsic } from ".";
import { Constants } from "./constants";
import { Utils } from "@as-substrate/core-utils";
import { IBlock } from "./interfaces";

/**
 * Class representing a Block into the Substrate Runtime
 */
export class Block implements IBlock{

    /**
     * Block Header
     */
    public header: IHeader

    /**
     * Block header hash
     */
    public headerHash: Option<Hash>
    
    /**
     * Array of Extrinsics
     */
    public body: IExtrinsic[]
    /**
     * Block Receipt
     */
    public receipt: Option<ByteArray>
    /**
     * Block message queue
     */
    public messageQueue: Option<ByteArray>
    /**
     * Block Justification
     */
    public justification: Option<ByteArray>

    constructor(header: IHeader, body: IExtrinsic[]) {
        this.header = header;
        this.headerHash = new Option<Hash>(null);
        this.body = body;
        this.receipt = new Option<ByteArray>(null);
        this.messageQueue = new Option<ByteArray>(null);
        this.justification = new Option<ByteArray>(null);
    }

    /**
    * SCALE Encodes the Block into u8[]
    */
    toU8a(): u8[] {
        let encoded = this.header.toU8a();
        if (this.body.length != 0) {
            const extrinsicsLength = new CompactInt(this.body.length);
            encoded = encoded.concat(extrinsicsLength.toU8a());
            for (let i = 0; i < this.body.length; i++) {
                encoded = encoded.concat(this.body[i].toU8a());
            }
        } else {
            encoded = encoded.concat(Constants.EMPTY_BYTE_ARRAY);
        }

        return encoded;
    }

    /**
     * Get header
     */
    getHeader(): IHeader{
        return this.header;
    }

    /**
     * Get array of extrinsics
     */
    getExtrinsics(): IExtrinsic[]{
        return this.body;
    }

    encodedLength(): i32{
        let len = this.header.encodedLength();
        for(let i: i32 = 0; i< this.body.length; i++){
            len += this.body[i].encodedLength();
        }
        return len;
    }
    /**
     * Instanciates new Block object from SCALE encoded byte array
     * @param input - SCALE encoded Block
     */
    static fromU8Array(input: u8[]): DecodedData<IBlock> {
        const decodedHeader: DecodedData<IHeader> = Header.fromU8Array(input);
        input = decodedHeader.getInput();

        const extrinsicsLength = Bytes.decodeCompactInt(input);
        input = input.slice(extrinsicsLength.decBytes);
        let extrinsics: IExtrinsic[] = [];
        for (let i = 0; i < <i32>extrinsicsLength.value; i++) {
            const decodedExtrinsic: DecodedData<IExtrinsic> = Extrinsic.fromU8Array(input);
            extrinsics.push(decodedExtrinsic.getResult());
            input = decodedExtrinsic.getInput();
        }
        
        const block = new Block(decodedHeader.getResult(), extrinsics);
        return new DecodedData(block, input);
    }

    @inline @operator('==')
    static eq(a: Block, b: Block): bool {
        return a.header == b.header && Utils.areArraysEqual(a.body, b.body);
    }
}