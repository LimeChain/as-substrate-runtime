import { Hash, CompactInt, Bytes } from "as-scale-codec";
import { Utils } from "../utils";
import { Option } from "./";
import { Constants } from "./../constants";
import { DecodedData } from "../codec/decoded-data";
import { DigestItem } from "./digest-items/digest-item";

/**
 * Class representing a Block Header into the Substrate Runtime
 */
export class Header {

    /**
     * 32-byte Blake hash of the header of the parent of the block
     */
    public parentHash: Hash
    /**
     * Integer, which represents the index of the current block in the chain.
     * It is equal to the number of the ancestor blocks.
     */
    public number: CompactInt
    /**
     * Root of the Merkle trie, whose leaves implement the storage of the system.
     */
    public stateRoot: Hash
    /**
     * Field reserved for the Runtime to validate the integrity of the extrinsics composing the block body.
     */
    public extrinsicsRoot: Hash
    /**
     * Field used to store any chain-specific auxiliary data, which could help the light clients interact with the block 
     * without the need of accessing the full storage as well as consensus-related data including the block signature. 
     */
    public digest: Option<DigestItem[]>

    constructor(parentHash: Hash, number: CompactInt, stateRoot: Hash, extrinsicsRoot: Hash, digest: Option<DigestItem[]>) {
        this.parentHash = parentHash;
        this.number = number;
        this.stateRoot = stateRoot;
        this.extrinsicsRoot = extrinsicsRoot;
        this.digest = digest;
    }

    /**
    * SCALE Encodes the Header into u8[]
    */
    toU8a(): u8[] {
        let digest:u8[] = [];
        if (this.digest.isSome()) {
            let digestItemArray = <DigestItem[]>this.digest.unwrap();
            const length = new CompactInt(digestItemArray.length);
            digest.concat(length.toU8a());
            digestItemArray = digestItemArray.splice(length.encodedLength());

            for (let i = 0; i < length.value; i++){
                digest = digest.concat(digestItemArray[i].toU8a());
            }
        } else {
            digest = Constants.EMPTY_BYTE_ARRAY;
        }

        return this.parentHash.toU8a()
            .concat(this.number.toU8a())
            .concat(this.stateRoot.toU8a())
            .concat(this.extrinsicsRoot.toU8a())
            .concat(digest);
    }

    /**
     * Instanciates new Header object from SCALE encoded byte array
     * @param input - SCALE encoded Header
     * TODO - avoid slicing the aray for better performance
     */
    static fromU8Array(input: u8[]): DecodedData<Header> {
        const parentHash = Hash.fromU8a(input);
        input = input.slice(parentHash.encodedLength());

        const data = Bytes.decodeCompactInt(input);
        const number = new CompactInt(data.value);
        input = input.slice(data.decBytes);

        const stateRoot = Hash.fromU8a(input);
        input = input.slice(stateRoot.encodedLength());

        const extrinsicsRoot = Hash.fromU8a(input);
        input = input.slice(extrinsicsRoot.encodedLength());

        const digest = this.decodeOptionalDigest(input);
        
        const result = new Header(parentHash, number, stateRoot, extrinsicsRoot, digest.result);
        return new DecodedData(result, digest.input);
    }

    /**
     * Decodes the byte array into Optional Hash and slices it depending on the decoding
     * TODO - move this function to a proper place
     * @param input - SCALE Encded byte array
     */
    private static decodeOptionalDigest(input: u8[]): DecodedData<Option<DigestItem[]>> {
        let digestOption = new Option<DigestItem[]>(null);
        if (Utils.isSet(input)) {
            let itemsLength = CompactInt.fromU8a(input);
            input = input.slice(itemsLength.encodedLength());
            digestOption = new Option<DigestItem[]>(new Array<DigestItem>());

            for (let i = 0; i < itemsLength.value; i++) {
                let decodedItem = DigestItem.fromU8Array(input);
                (<DigestItem[]>digestOption.unwrap()).push(decodedItem.result);
                input = decodedItem.input;
            }
        } else {
            input = input.slice(1);
        }
        return new DecodedData<Option<DigestItem[]>>(digestOption, input);
    }

    @inline @operator('==')
    static eq(a: Header, b: Header): bool {
        let areEqual = a.parentHash == b.parentHash
            && a.number == b.number
            && a.stateRoot == b.stateRoot
            && a.extrinsicsRoot == b.extrinsicsRoot;
        
        if (a.digest.isSome() && b.digest.isSome()) {
            return areEqual && Utils.areArraysEqual(<DigestItem[]>a.digest.unwrap(), <DigestItem[]>b.digest.unwrap());
        } else if (!a.digest.isSome() && !b.digest.isSome()) {
            return areEqual;
        }else {
            return false;
        }
    }
}