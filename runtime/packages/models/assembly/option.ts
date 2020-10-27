// import { T } from "as-scale-codec";
// import { IOption } from "./interfaces/i-option";

/**
 * Class representing an optional value (T or null)
 */
export class Option<T>{

    public value: T | null;

    constructor(value: T | null) {
        this.value = value;
    }

    /**
     * Checks whether the `Option` contains a value.
     *
     * @returns True if the `Option` has some value.
     */
    isSome(): bool {
        return this.value ? true : false;
    }

    /**
	 * Unwraps the `Option`, returning the inner value (or `null` if there was none).
	 *
	 * @returns The inner value, or `null` if there was none.
	 */
    unwrap(): T | null {
        return this.value;
    }
    
    // /**
    //  * Get encoded length of this instance  
    // */
    // encodedLength(): i32{
    //     if (this.value){
    //         return this.value.encodedLength();
    //     }
    //     return 0;
    // }

    // toU8a(): u8[]{
    //     if(this.value){
    //         return this.value.toU8a();
    //     }
    //     return [];
    // }
    /**
     * Returns true/false depending on the Option whether it is Some or None
     * @param bytes - SCALE Encoded bytes
     */
    static isArraySomething(bytes: u8[]): bool {
        return bytes[0] != 0;
    }
}
