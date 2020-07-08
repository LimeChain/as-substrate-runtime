import { Hash, UInt64, ByteArray } from "as-scale-codec";
import { DecodedData } from "../codec/decoded-data";

/**
 * Class representing an Extrinsic in the Substrate Runtime
 */
export class Extrinsic {
    
    /**
     * from address 
     */
    public from: Hash
    
    /**
     * to address
     */
    public to: Hash

    /**
     * amount of the transfer
     */
    public amount: UInt64

    /**
     * nonce of the transaction
     */
    public nonce: UInt64

    /**
     * the signature of the transaction (64 byte array)
     */
    public signature: ByteArray

    constructor(from: Hash, to: Hash, amount: UInt64, nonce: UInt64, signature: ByteArray) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.nonce = nonce;
        this.signature = signature;
    }

    /**
    * SCALE Encodes the Header into u8[]
    */
    toU8a(): u8[] {
        return [];
    }

    /**
     * Instanciates new Header object from SCALE encoded byte array
     * @param input - SCALE encoded Header
     * TODO - avoid slicing the aray for better performance
     */
    static fromU8Array(input: u8[]): DecodedData<Extrinsic> {
        const from = Hash.fromU8a(input);
        input = input.slice(from.encodedLength());

        const to = Hash.fromU8a(input);
        input = input.slice(to.encodedLength());

        const amount = UInt64.fromU8a(input);
        input = input.slice(amount.encodedLength());

        const nonce = UInt64.fromU8a(input);
        input = input.slice(nonce.encodedLength());

        const signature = ByteArray.fromU8a(input);
        input = input.slice(signature.encodedLength());
        
        const extrinsic = new Extrinsic(from, to, amount, nonce, signature);

        return new DecodedData(extrinsic, input);
    }
}