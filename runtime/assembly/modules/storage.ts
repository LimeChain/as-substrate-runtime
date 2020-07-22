import { Serialiser } from '../api/serialiser';
import { ext_storage_set_version_1, ext_storage_get_version_1, ext_storage_read_version_1, ext_storage_clear_version_1, ext_storage_exists_version_1 } from '../env';
import { Option } from '../models';
import { Int32, Bool } from 'as-scale-codec';
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
     * @param key key of the data to get
     * @param offset offset beyond which the value is copied
     */
    export function read(key: u8[], valueOut: ArrayBuffer, offset: i32): Option<Int32> {
        const key64: u64 = Serialiser.serialiseResultwOutRetain(key);
        const valueOut64 :u64 = Serialiser.serialiseBufferwOutRetain(valueOut);

        const result = ext_storage_read_version_1(key64, valueOut64, offset);

        const ptrSize: i32[] = Serialiser.separatePointerSize(result);
        let valueU8: u8[] = Serialiser.deserialiseInput(ptrSize[0], ptrSize[1]);

        if(Option.isArraySomething(valueU8)){
            return new Option<Int32>(Int32.fromU8a(valueU8.slice(1)));
        }else{
            return new Option<Int32>(null);
        }
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
    export function exists(key: u8[]): Bool {
        const key64: u64 = Serialiser.serialiseResult(key);
        const itExists: i32 = ext_storage_exists_version_1(key64);
        return new Bool(itExists as bool);
    }
}