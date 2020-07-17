import {Utils} from './utils';
import { Serialiser } from './api/serialiser';
import { ext_storage_set, ext_storage_get } from './env';
import { Bytes } from 'as-scale-codec';

/**
 * Returns the value of the passed key
 * @param key key to access the storage
 */
export function storage_get(key: string): u8[] {
    const u8Key = Uint8Array.wrap(String.UTF8.encode(key));
    const key64: u64 = Serialiser.serialise_result(Utils.toU8Array(u8Key));
    const result: u64 = ext_storage_get(key64);
    const ptr_size: i32[] = Serialiser.separate_pointer_size(result);
    return Serialiser.deserialise_input(ptr_size[0], ptr_size[1]);
}
/**
 * Sets the value in storage for a given key
 * @param pair an array with key, value pair
 */
export function storage_set(key: string, value: string): void {
    const u8Key = Uint8Array.wrap(String.UTF8.encode(key));
    const u8Value = Uint8Array.wrap(String.UTF8.encode(value));
    const key64: u64 = Serialiser.serialise_result(Utils.toU8Array(u8Key));
    const value64: u64 = Serialiser.serialise_result(Utils.toU8Array(u8Value));
    ext_storage_set(key64, value64);
}

export function storage_test(data: i32, len: i32): u64 {
    const input = Serialiser.deserialise_input(data, len);
    const key: string = "cool";
    const buff = new Uint8Array(input.length);
    Bytes.copyToTyped(input, buff);
    const value: string = String.UTF8.decode(buff.buffer);
    storage_set(key, value);
    return Serialiser.serialise_result(input);
}