import { Utils } from "../utils";

export class Serialiser {

    /**
     * Deserialises the arguments passed using the pointer and the length provided.
     * Copies the arguments into Uint8Array
     * @param ptr 
     * @param len 
     */
    static deserialise_input(ptr: i32, len: i32): u8[] {
        var input = new ArrayBuffer(len);
        memory.copy(changetype<usize>(input), ptr, len);
        return Utils.toU8Array(Uint8Array.wrap(input)); // Copying the TypedArray to Array is a temporary solution
    }

    /**
     * Serialises the arguments into u64 number containing the pointer and the length of the bytes
     * @param value_ptr 
     * @param value_len 
     */
    static serialise_result(result: u8[]): u64 {
        let value_ptr = result.dataStart;
        let value_size = result.length;

        __retain(value_ptr); // adds ref to the pointer, so it's not GCed
        return ((value_size as u64) << 32) | value_ptr;
    }
}