import { DigestItem, DigestItemType } from ".";
import { DecodedData } from "./..";
import { Hash } from "as-scale-codec";

/**
 * Class representing ChangeTrieRoot Digest Item into the Substrate Runtime
 */
export class ChangeTrieRoot extends DigestItem {

    /**
     * Digest Item Payload
     */
    public value: Hash

    constructor(value: Hash) {
        super(DigestItemType.ChangeTrieRoot);
        this.value = value;
    }

    /**
     * Instanciates Other DigestItem from SCALE Encoded Bytes
     */
    static fromU8Array(input: u8[]): DecodedData<DigestItem> {
        const value = Hash.fromU8a(input);
        input = input.slice(value.encodedLength());
        return new DecodedData<DigestItem>(new ChangeTrieRoot(value), input);
    }

    /**
     * SCALE Encodes the ChangeTrieRoot DigestItem into u8[]
     */
    toU8a(): u8[] {
        let encoded: u8[] = [<u8>DigestItemType.ChangeTrieRoot];
        return encoded.concat(this.value.toU8a());
    }

    /**
     * Checks whether the value passed is equal to this instance
     * @param other
     */
    equals(other: ChangeTrieRoot): bool {
        return this.value == other.value;
    }


}
