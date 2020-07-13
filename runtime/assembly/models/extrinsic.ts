import { Hash, UInt64, BIT_LENGTH } from "as-scale-codec";
import { DecodedData } from "../codec/decoded-data";
import { Signature } from "./signature";
import { Constants } from "./../constants";

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
    public signature: Signature

    constructor(from: Hash, to: Hash, amount: UInt64, nonce: UInt64, signature: Signature) {
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
        return this.from.toU8a()
            .concat(this.to.toU8a())
            .concat(this.amount.toU8a())
            .concat(this.nonce.toU8a())
            .concat(this.signature.value);
    }

    /**
     * Instanciates new Extrinsic object from SCALE encoded byte array
     * @param input - SCALE encoded Extrinsic
     * TODO - avoid slicing the aray for better performance
     */
    static fromU8Array(input: u8[]): DecodedData<Extrinsic> {
        const from = Hash.fromU8a(input);
        input = input.slice(from.encodedLength());

        const to = Hash.fromU8a(input);
        input = input.slice(to.encodedLength());

        const amount = UInt64.fromU8a(input.slice(0, BIT_LENGTH.INT_64));
        input = input.slice(amount.encodedLength());

        const nonce = UInt64.fromU8a(input.slice(0, BIT_LENGTH.INT_64));
        input = input.slice(nonce.encodedLength());

        const signature = new Signature(input.slice(0, Constants.SIGNATURE_LENGTH));
        input = input.slice(signature.value.length);
        
        const extrinsic = new Extrinsic(from, to, amount, nonce, signature);

        return new DecodedData(extrinsic, input);
    }

    @inline @operator('==')
    static eq(a: Extrinsic, b: Extrinsic): bool {
        let equal = 
            a.from == b.from 
            && a.to == b.to
            && a.amount.value == b.amount.value
            && a.nonce.value == b.nonce.value
            && a.signature == b.signature;
        return equal;
    }
}