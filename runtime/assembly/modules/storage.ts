import { Serialiser } from '../api/serialiser';
import { ext_storage_set_version_1, ext_storage_get_version_1, ext_storage_read_version_1, ext_storage_clear_version_1, ext_storage_exists_version_1 } from '../env';
import { Option } from '../models';
import { Utils } from '../utils';
import { Int32 } from 'as-scale-codec';
import { ByteArray } from 'as-scale-codec';

/**
 * Namespace exporting Storage related functions
 */
export namespace Storage {

    /**
     * Returns the value of the passed key
     * @param key key to access the storage
     */
    export function get(key: u8[]): Option<ByteArray> {
        const key64: u64 = Serialiser.serialiseResultwOutRetain(key);
        const result: u64 = ext_storage_get_version_1(key64);
        const ptrSize: i32[] = Serialiser.separatePointerSize(result);
        let valueU8: u8[] = Serialiser.deserialiseInput(ptrSize[0], ptrSize[1]);
        
        if (Option.isArraySomething(valueU8)) {
            const byteArray = ByteArray.fromU8a(valueU8.slice(1));
            return new Option<ByteArray>(byteArray);
        } else {
            return new Option<ByteArray>(null);
        }
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
    /**
     * Gets the given key from storage, placing the value into a buffer and returning the number of bytes that the
     * entry in storage has beyond the offset. 
     * ArrayBuffer has fixed length of 20.
     * Returns Option instance with populated ArrayBuffer concatenated to the result from storage_read
     * @param key key of the data to get
     * @param offset offset beyond which the value is copied
     */
    export function read(key: u8[], offset: i32): Option<u8[]> {
        const key64: u64 = Serialiser.serialiseResultwOutRetain(key);
        const valueOut = new ArrayBuffer(20);
        let valuePtr = changetype<usize>(valueOut);
        let valueSize = valueOut.byteLength;
        const valueOut64 = ((valueSize as u64) << 32) | valuePtr;

        const result = ext_storage_read_version_1(key64, valueOut64, offset);
        
        const ptrSize: i32[] = Serialiser.separatePointerSize(result);
        let valueu8: u8[] = Serialiser.deserialiseInput(ptrSize[0], ptrSize[1]);

        let buff = Uint8Array.wrap(valueOut);
        let res = Utils.toU8Array(buff);
        
        return Option.isArraySomething(valueu8) ? new Option<u8[]>(valueu8.slice(1).concat(res)): new Option<u8[]>(null);
    }
    /**
     * Clears the storage of the given key and its value.
     * @param key key of the data to clear
     */
    export function clear(key: u8[]): void {
        const key64: u64 = Serialiser.serialiseResultwOutRetain(key);
        ext_storage_clear_version_1(key64);
    }

    /**
     * Checks whether the given key exists in storage.
     * @param key key of the data to check
     */
    export function exists(key: u8[]): u8[] {
        const key64: u64 = Serialiser.serialiseResult(key);
        const itExists: i32 = ext_storage_exists_version_1(key64);
        const res: Int32 = new Int32(itExists);
        return res.toU8a();
    }
}