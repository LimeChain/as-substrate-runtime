import { Hash, CompactInt, ByteArray } from "as-scale-codec";
import { Header, Extrinsic } from ".";

/**
 * Class representing a Block into the Substrate Runtime
 */
export class Block {

    /**
     * Block header hash
     */
    private headerHash: Hash
    /**
     * Block Header
     */
    private header: Header
    /**
     * Array of Extrinsics
     */
    private body: Extrinsic[]
    /**
     * Block Receipt
     */
    private receipt: ByteArray
    /**
     * Block message queue
     */
    private messageQueue: ByteArray
    /**
     * Block Justification
     */
    private justification: ByteArray

    constructor() {
        // TODO
    }

    /**
     * SCALE Encodes the Block into u8[]
     */
    toU8a(): u8[] {
        // Encode headerHash and header
        let encoded = this.headerHash.toU8a()
            .concat(this.header.toU8a());
            
        // Encode body
        encoded = encoded.concat((new CompactInt(this.body.length)).toU8a())
        for (let i = 0; i < this.body.length; i++) {
            encoded = encoded.concat(this.body[i].toU8a())
        }

        // Encode Receipt, MessageQueue and Justification
        return encoded.concat(this.receipt.toU8a())
            .concat(this.messageQueue.toU8a())
            .concat(this.justification.toU8a())
    } 

}