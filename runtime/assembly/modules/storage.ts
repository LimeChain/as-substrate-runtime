import { Serialiser } from '../api/serialiser';
import { ext_storage_set_version_1, ext_storage_get_version_1 } from '../env';
import { Option } from '../models';
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
}