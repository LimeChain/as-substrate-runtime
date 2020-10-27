import { ISignature } from "./interfaces/signature";

/**
 * Class representing a Signature in the Substrate Runtime
 */
export class Signature {

    /**
     * Length of the bytes of a signature
     */
    public static readonly SIGNATURE_LENGTH:i32 = 64;

    /**
     * Array of the signature bytes
     */
    public value: u8[];

    constructor(input: u8[]) {
        assert(input.length >= Signature.SIGNATURE_LENGTH, "Signature: input value must be atleast 64 bytes. EOF");
        this.value = new Array<u8>();
        this.value = this.value.concat(input);
    }

    toU8a(): u8[]{
        return this.value;
    }

    getValue(): u8[]{
        return this.value;
    }
    encodedLength(): i32{
        return this.value.length;
    }

    @inline @operator('==')
    static eq(a: Signature, b: Signature): bool {
        let areEqual = true;
        for (let i = 0; i < Signature.SIGNATURE_LENGTH; i++) {
            if (a.value[i] != b.value[i]) {
                areEqual = false;
                break;
            }
        }
        return areEqual;
    }

    toString(): string {
        return this.value.toString();
    }

}