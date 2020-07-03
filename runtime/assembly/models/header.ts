import { Hash, Int64 } from "as-scale-codec";

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
    private number: Int64
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
    private digest: Hash

    /**
    * SCALE Encodes the Header into u8[]
    */
    toU8a(): u8[] {
        return this.parentHash.toU8a()
            .concat(this.number.toU8a())
            .concat(this.stateRoot.toU8a())
            .concat(this.extrinsicsRoot.toU8a()
            .concat(this.digest.toU8a()));
    }
}