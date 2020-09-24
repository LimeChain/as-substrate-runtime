import { Serialiser } from '@as-substrate/core-utils';
import { Option } from '@as-substrate/models';
import { ext_storage_set_version_1, ext_storage_get_version_1, ext_storage_read_version_1, ext_storage_clear_version_1, ext_storage_exists_version_1, ext_storage_root_version_1, ext_storage_changes_root_version_1 } from './env';
import { Int32, Bool, ByteArray } from 'as-scale-codec';

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
        let resultU8a: u8[] = Serialiser.deserialiseInput(ptrSize[0], ptrSize[1]);
        if (Option.isArraySomething(resultU8a)) {
            const byteArray = ByteArray.fromU8a(resultU8a.slice(1));
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
        let resultU8a: u8[] = Serialiser.deserialiseInput(ptrSize[0], ptrSize[1]);

        if(Option.isArraySomething(resultU8a)){
            return new Option<Int32>(Int32.fromU8a(resultU8a.slice(1)));
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
     * Take a value from storage, removing it afterwards.
     * @param key 
     */
    export function take(key: u8[]): u8[]{
        const value: Option<ByteArray> = Storage.get(key);
        Storage.clear(key);
        return value.isSome() ? (<ByteArray>value.unwrap()).values : [];
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
    /**
     * Commits all existing operations and computes the resulting storage root.
     */
    export function storageRoot(): u8[] {
        const root = ext_storage_root_version_1();
        const ptrSize: i32[] = Serialiser.separatePointerSize(root);
        let rootU8: u8[] = Serialiser.deserialiseInput(ptrSize[0], ptrSize[1]);
        return rootU8;
    }
    /**
     * Commits all existing operations and gets the resulting change root. The parent hash is a SCALE encoded change
        root.
     * @param parentHash 
     */
    export function storageChangeRoot(parentHash: u8[]): Option<ByteArray>{
        const parentHashU64: u64 = Serialiser.serialiseResultwOutRetain(parentHash);
        const result: u64 = ext_storage_changes_root_version_1(parentHashU64);
        const ptrSize: i32[] = Serialiser.separatePointerSize(result);
        let resultU8a: u8[] = Serialiser.deserialiseInput(ptrSize[0], ptrSize[1]);

        if (Option.isArraySomething(resultU8a)) {
            const byteArray = ByteArray.fromU8a(resultU8a.slice(1));
            return new Option<ByteArray>(byteArray);
        } else {
            return new Option<ByteArray>(null);
        }
    }
}