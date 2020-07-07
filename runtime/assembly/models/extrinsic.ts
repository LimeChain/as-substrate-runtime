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
        const extrinsic = new Extrinsic();

        return new DecodedData(extrinsic, input);
    }
}