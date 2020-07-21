import { Serialiser } from '../api/serialiser';
import { ext_storage_set_version_1, ext_storage_get_version_1, ext_storage_read_version_1 } from '../env';
import { Option } from '../models';
import { Utils } from '../utils';

/**
 * Namespace exporting Storage related functions
 */
export namespace Storage {

    /**
     * Returns the value of the passed key
     * @param key key to access the storage
     */
    export function get(key: u8[]): Option<u8[]> {
        const key64: u64 = Serialiser.serialiseResultwOutRetain(key);
        const result: u64 = ext_storage_get_version_1(key64);
        const ptrSize: i32[] = Serialiser.separatePointerSize(result);
        let valueu8: u8[] = Serialiser.deserialiseInput(ptrSize[0], ptrSize[1]);
        return Option.isArraySomething(valueu8) ? new Option<u8[]>(valueu8.slice(1)): new Option<u8[]>(null);
    }

    /**
     * Sets the value in storage for a given key
     * @param key key pair
     * @param value value of the pair
     */
    export function set(key: u8[], value: u8[]): void {
        const key64: u64 = Serialiser.serialiseResultwOutRetain(key);
        const value64: u64 = Serialiser.serialiseResultwOutRetain(value);
        ext_storage_set_version_1(key64, value64);
    }

    export function read(key: u8[], offset: i32): u8[] {
        const key64: u64 = Serialiser.serialiseResultwOutRetain(key);
        const valueOut = new ArrayBuffer(80);
        let valuePtr = changetype<usize>(valueOut);
        let valueSize = valueOut.byteLength;
        const valueOut64 = ((valueSize as u64) << 32) | valuePtr;
        const result = ext_storage_read_version_1(key64, valueOut64, offset);
        const ptrSize: i32[] = Serialiser.separatePointerSize(result);
        let valueu8: u8[] = Serialiser.deserialiseInput(ptrSize[0], ptrSize[1]);
        //return Option.isArraySomething(valueu8) ? new Option<u8[]>(valueu8.slice(1)): new Option<u8[]>(null);
        // return result;
        let buff = Uint8Array.wrap(valueOut);
        let res = Utils.toU8Array(buff);
        return res;
    }
}