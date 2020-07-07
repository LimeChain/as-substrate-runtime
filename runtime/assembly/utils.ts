export namespace Utils {

    /**
     * Returns new Array<u8> from Uint8 Typed array
     * @param typedArr 
     */
    export function toU8Array(typedArr: Uint8Array): u8[] {
        let res = new Array<u8>(2);
        for (let i = 0; i < typedArr.length; i++) {
            res[i] = typedArr[i];
        }
        return res;
    }

    /**
     * Returns true/false depending on the Option whether it is Some or None
     * @param bytes - SCALE Encoded bytes
     */
    export function isSet(bytes: u8[]): bool {
        return bytes[0] != 0;
    }

}