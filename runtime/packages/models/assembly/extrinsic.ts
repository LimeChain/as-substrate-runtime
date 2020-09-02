import { Hash, UInt64, BIT_LENGTH, Bool, CompactInt } from "as-scale-codec";
import { Signature, DecodedData } from ".";

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
    public nonce: CompactInt

    /**
     * the signature of the transaction (64 byte array)
     */
    public signature: Signature

    /**
     * Determines whether to exhaust the gas. Default false
     */
    public exhaustResourcesWhenNotFirst: Bool

    constructor(from: Hash, to: Hash, amount: UInt64, nonce: CompactInt, signature: Signature, exhaustResourcesWhenNotFirst: Bool) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.nonce = nonce;
        this.signature = signature;
        this.exhaustResourcesWhenNotFirst = exhaustResourcesWhenNotFirst;
    }

    /**
    * SCALE Encodes the Header into u8[]
    */
    toU8a(): u8[] {
        return this.from.toU8a()
            .concat(this.to.toU8a())
            .concat(this.amount.toU8a())
            .concat(this.nonce.toU8a())
            .concat(this.signature.value)
            .concat(this.exhaustResourcesWhenNotFirst.toU8a());
    }

    /**
     * Instanciates new Extrinsic object from SCALE encoded byte array
     * @param input - SCALE encoded Extrinsic
     * TODO - avoid slicing the aray for better performance
     */
    static fromU8Array(input: u8[]): DecodedData<Extrinsic> {
        assert(input.length >= 144, "Extrinsic: Invalid bytes provided. EOF");
        const from = Hash.fromU8a(input);
        input = input.slice(from.encodedLength());

        const to = Hash.fromU8a(input);
        input = input.slice(to.encodedLength());


        const exhaustResourcesWhenNotFirst = Bool.fromU8a(input.slice(0, 1));
        input = input.slice(exhaustResourcesWhenNotFirst.encodedLength());

        const signature = new Signature(input.slice(0, Signature.SIGNATURE_LENGTH));
        input = input.slice(signature.value.length);
        
        const blockWeight: u8[] = input.slice(0, 2);
        input = input.slice(2);

        const nonce = CompactInt.fromU8a(input);
        input = input.slice(nonce.encodedLength());

        const transactionFee: u8[] = input.slice(0, 1);
        input = input.slice(1);

        const callIndex: u8[] = input.slice(0, 2);
        input = input.slice(2);

        const amount = UInt64.fromU8a(input.slice(0, BIT_LENGTH.INT_64));
        input = input.slice(amount.encodedLength());

        const extrinsic = new Extrinsic(from, to, amount, nonce, signature, exhaustResourcesWhenNotFirst);

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

    @inline @operator('!=')
    static notEq(a: Extrinsic, b: Extrinsic): bool {
        return !Extrinsic.eq(a, b);
    }

}