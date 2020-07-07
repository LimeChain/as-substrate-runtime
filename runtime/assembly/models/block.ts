import { Hash, CompactInt, ByteArray } from "as-scale-codec";
import { Header, Extrinsic } from ".";

/**
 * Class representing a Block into the Substrate Runtime
 */
export class Block {

    /**
     * Block header hash
     */
    public headerHash: Hash
    /**
     * Block Header
     */
    public header: Header
    /**
     * Array of Extrinsics
     */
    public body: Extrinsic[]
    /**
     * Block Receipt
     */
    public receipt: ByteArray
    /**
     * Block message queue
     */
    public messageQueue: ByteArray
    /**
     * Block Justification
     */
    public justification: ByteArray

    constructor(header: Header) {
        this.headerHash = new Hash([]);
        this.header = header;
        this.body = [];
        this.receipt = new ByteArray([]);
        this.messageQueue = new ByteArray([]);
        this.justification = new ByteArray([]);
    }

    /**
     * SCALE Encodes the Block into u8[]
     */
    toU8a(): u8[] {
        // Encode headerHash and header
        // let encoded = this.headerHash.toU8a()
            //
            // .concat(this.header.toU8a());
            
        // // Encode body
        // encoded = encoded.concat((new CompactInt(this.body.length)).toU8a())
        // for (let i = 0; i < this.body.length; i++) {
        //     encoded = encoded.concat(this.body[i].toU8a())
        // }

        // // Encode Receipt, MessageQueue and Justification
        // return encoded.concat(this.receipt.toU8a())
        //     .concat(this.messageQueue.toU8a())
        //     .concat(this.justification.toU8a())
        return this.header.toU8a();
    }

    /**
     * Instanciates new Block object from SCALE encoded byte array
     * @param input - SCALE encoded Block
     */
    static fromU8Array(input: u8[]): Block {
        const header = Header.fromU8Array(input);
        return new Block(header);
    }

}