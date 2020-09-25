import { Hash, ScaleString } from 'as-scale-codec';

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
     * By given 2 arrays, checks whether their values are equal (strict equal by index)
     */
    export function areArraysEqual<T>(a: Array<T>, b: Array<T>): bool {
        if (a.length != b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Converts array of strings to array of bytes
     * @param args array of strings
     */
    export function stringsToBytes(args: string[], scale: bool): u8[]{
        let result: u8[] = [];
        for (let i=0; i<args.length ; i++){
            const strScale = new ScaleString(args[i]); 
            result = result.concat(scale ? strScale.toU8a() : strScale.values);
        }
        return result;
    }
    /**
     * 
     * @param byte default byte
     */
    export function getPopulatedHash(byte: u8): Hash {
        const hashBytes: u8[] = new Array<u8>(32);
        hashBytes.fill(byte);
        return Hash.fromU8a(hashBytes);
    }
}