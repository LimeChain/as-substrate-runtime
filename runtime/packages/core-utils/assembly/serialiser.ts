import { Utils } from "./utils";

export class Serialiser {

    /**
     * Deserialises the arguments passed using the pointer and the length provided.
     * Copies the arguments into Uint8Array
     * @param ptr 
     * @param len 
     */
    static deserialiseInput(ptr: i32, len: i32): u8[] {
        var input = new ArrayBuffer(len);
        memory.copy(changetype<usize>(input), ptr, len);
        return Utils.toU8Array(Uint8Array.wrap(input)); // Copying the TypedArray to Array is a temporary solution
    }
    /**
     * Returns pointer to and size of the buffer, respectively
     * @param ptr_size runtime pointer size as specified by Polkadot Host API
     */
    static separatePointerSize(ptr_size: u64): i32[] {
        let valuePtr: i32 = i32(ptr_size);
        let valueSize: i32 = i32((ptr_size >> 32));
        return [valuePtr, valueSize];
    }

    /**
     * Serialises the arguments into u64 number containing the pointer and the length of the bytes
     * @param result u8 array to be serialised 
     */
    static serialiseResult(result: u8[]): u64 {
        let valuePtr = result.dataStart;
        let valueSize = result.length;

        __retain(valuePtr); // adds ref to the pointer, so it's not GCed
        return ((valueSize as u64) << 32) | valuePtr;
    }
    /**
     * Does the same thing as the above function, but without retaining the pointer
     */
    static serialiseResultwOutRetain(result: u8[]): u64 {
        let valuePtr = result.dataStart;
        let valueSize = result.length;
        return ((valueSize as u64) << 32) | valuePtr;
    }

    static serialiseBufferwOutRetain(buffer: ArrayBuffer): u64 {
        let valuePtr = changetype<usize>(buffer);
        let valueSize = buffer.byteLength;
        const buffer64 = ((valueSize as u64) << 32) | valuePtr;
        return buffer64;
    }

    /**
     * Serialize bytes
     * @param value 
     */
    static getPointerToBytes(value: u8[]): i32 {
        return value.dataStart as i32;
    }
}