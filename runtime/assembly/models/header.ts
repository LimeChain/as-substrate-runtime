import { Hash, CompactInt, Bytes } from "as-scale-codec";
import { Utils } from "../utils";
import { Option } from "./";
import { Constants } from "./../constants";
import { DecodedData } from "../codec/decoded-data";

/**
 * Class representing a Block Header into the Substrate Runtime
 */
export class Header {

    /**
     * 32-byte Blake hash of the header of the parent of the block
     */
    private parentHash: Hash
    /**
     * Integer, which represents the index of the current block in the chain.
     * It is equal to the number of the ancestor blocks.
     */
    private number: CompactInt
    /**
     * Root of the Merkle trie, whose leaves implement the storage of the system.
     */
    private stateRoot: Hash
    /**
     * Field reserved for the Runtime to validate the integrity of the extrinsics composing the block body.
     */
    private extrinsicsRoot: Hash
    /**
     * Field used to store any chain-specific auxiliary data, which could help the light clients interact with the block 
     * without the need of accessing the full storage as well as consensus-related data including the block signature. 
     */
    private digest: Option<Hash> // TODO not ready..

    constructor(parentHash: Hash, number: CompactInt, stateRoot: Hash, extrinsicsRoot: Hash, digest: Option<Hash>) {
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
        let digest = this.digest.isSome() ? (<Hash>this.digest.unwrap()).toU8a() : Constants.EMPTY_BYTE_ARRAY;

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

        const digest = this.decodeOptionalHash(input);
        
        const result = new Header(parentHash, number, stateRoot, extrinsicsRoot, digest);
        return new DecodedData(result, input);
    }

    /**
     * Decodes the byte array into Optional Hash and slices it depending on the decoding
     * TODO - move this function to a proper place
     * @param input - SCALE Encded byte array
     */
    private static decodeOptionalHash(input: u8[]): Option<Hash> {
        let valueOption = new Option<Hash>(null);
        if (Utils.isSet(input)) {
            valueOption.value = Hash.fromU8a(input);
            input = input.slice((<Hash>valueOption.unwrap()).encodedLength())
        } else {
            input.slice(1);
        }
        return valueOption;
    }
}