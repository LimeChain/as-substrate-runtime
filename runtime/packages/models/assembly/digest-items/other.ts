import { DigestItem, DigestItemType } from ".";
import { DecodedData } from "..";
import { ByteArray } from "as-scale-codec";

/**
 * Class representing Other Digest Item into the Substrate Runtime
 */
export class Other extends DigestItem {

    /**
     * Digest Item Payload
     */
    public value: ByteArray

    constructor(value: ByteArray) {
        super(DigestItemType.Other);
        this.value = value;
    }

    /**
     * Instanciates Other DigestItem from SCALE Encoded Bytes
     */
    static fromU8Array(input: u8[]): DecodedData<DigestItem> {
        const value = ByteArray.fromU8a(input);
        input = input.slice(value.encodedLength());
        return new DecodedData<DigestItem>(new Other(value), input);
    }

    encodedLength(): i32{
        return this.value.encodedLength() + 1;
    }
    /**
     * SCALE Encodes the Other DigestItem into u8[]
     */
    toU8a(): u8[] {
        let encoded: u8[] = [<u8>DigestItemType.Other];
        return encoded.concat(this.value.toU8a());
    }

    /**
     * Checks whether the value passed is equal to this instance
     * @param other 
     */
    equals(other: Other): bool {
        return this.value == other.value;
    }

}