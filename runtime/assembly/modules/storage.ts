import {Utils} from '../utils';
import { Serialiser } from '../api/serialiser';
import { ext_storage_set_version_1, ext_storage_get_version_1 } from '../env';

/**
 * Namespace exporting Storage related functions
 */
export namespace Storage {

    /**
     * Returns the value of the passed key
     * @param key key to access the storage
     */
    export function get(key: string): u8[] {
        const u8Key = Uint8Array.wrap(String.UTF8.encode(key));
        const key64: u64 = Serialiser.serialise_result(Utils.toU8Array(u8Key));
        const result: u64 = ext_storage_get_version_1(key64);
        const ptr_size: i32[] = Serialiser.separate_pointer_size(result);
        let valueu8: u8[] = Serialiser.deserialise_input(ptr_size[0], ptr_size[1]);
        if (valueu8[0] == 1){
            return valueu8.slice(2, valueu8.length);
        }
        return valueu8;
    }

    /**
     * Sets the value in storage for a given key
     * @param key key pair
     * @param value value of the pair
     */
    export function set(key: string, value: string): void {
        const u8Key = Uint8Array.wrap(String.UTF8.encode(key));
        const u8Value = Uint8Array.wrap(String.UTF8.encode(value));
        const key64: u64 = Serialiser.serialise_result(Utils.toU8Array(u8Key));
        const value64: u64 = Serialiser.serialise_result(Utils.toU8Array(u8Value));
        ext_storage_set_version_1(key64, value64);
    }
}