import { Hash, UInt64, Bool, CompactInt, BytesReader } from "as-scale-codec";
import { Signature, DecodedData } from "..";
import { Extrinsic, ExtrinsicType } from "./extrinsic";

/**
 * Class representing an Extrinsic in the Substrate Runtime
 */
export class SignedTransaction extends Extrinsic {
    
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

    /**
     * Determines whether to exhaust the gas. Default false
     */
    public exhaustResourcesWhenNotFirst: Bool

    constructor(from: Hash, to: Hash, amount: UInt64, nonce: UInt64, signature: Signature, exhaustResourcesWhenNotFirst: Bool) {
        super(ExtrinsicType.SignedTransaction);
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
        let len = new CompactInt(ExtrinsicType.SignedTransaction);
        return len.toU8a()
            .concat(this.from.toU8a())
            .concat(this.to.toU8a())
            .concat(this.amount.toU8a())
            .concat(this.nonce.toU8a())
            .concat(this.signature.value)
            .concat(this.exhaustResourcesWhenNotFirst.toU8a());
    }

    /**
     * get SCALE encoded bytes for the Transfer instance
     */
    getTransferBytes(): u8[]{
        return this.from.toU8a()
            .concat(this.to.toU8a())
            .concat(this.amount.toU8a())
            .concat(this.nonce.toU8a())
    }

    /**
     * Instanciates new Extrinsic object from SCALE encoded byte array
     * @param input - SCALE encoded Extrinsic
     * TODO - avoid slicing the aray for better performance
     */
    static fromU8Array(input: u8[]): DecodedData<Extrinsic> {
        assert(input.length >= 144, "Extrinsic: Invalid bytes provided. EOF");

        const bytesReader = new BytesReader(input);
        const from: Hash = bytesReader.readHash();
        const to: Hash = bytesReader.readHash();
        const amount: UInt64 = bytesReader.readUInt64();
        const nonce: UInt64 = bytesReader.readUInt64();
        const signature: Signature = new Signature(bytesReader.readBytes(Signature.SIGNATURE_LENGTH));
        const exhaustResourcesWhenNotFirst: Bool = bytesReader.readBool();

        const extrinsic = new SignedTransaction(from, to, amount, nonce, signature, exhaustResourcesWhenNotFirst);
        return new DecodedData(extrinsic, bytesReader.getLeftoverBytes());
    }

    @inline @operator('==')
    static eq(a: SignedTransaction, b: SignedTransaction): bool {
        let equal = 
            a.from == b.from 
            && a.to == b.to
            && a.amount.value == b.amount.value
            && a.nonce.value == b.nonce.value
            && a.signature == b.signature;
        return equal;
    }

    @inline @operator('!=')
    static notEq(a: SignedTransaction, b: SignedTransaction): bool {
        return !SignedTransaction.eq(a, b);
    }

}