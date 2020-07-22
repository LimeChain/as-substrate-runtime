/**
 * Temporary test functions for the Storage module
 */
import { Storage } from '../../modules/storage';
import { Serialiser } from '../serialiser';
import { ByteArray, Int32 } from 'as-scale-codec';

/**
 * Test get method of storage
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_storage_set(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    const key = ByteArray.fromU8a(input);
    input = input.slice(key.encodedLength());
    const value = ByteArray.fromU8a(input);    
    input = input.slice(value.encodedLength());
    Storage.set(key.toU8a(), value.toU8a());
    return Serialiser.serialiseResult(input);
}

/**
 * Test set method of storage
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_storage_get(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    const value = Storage.get(input);
    return value.isSome() ? Serialiser.serialiseResult((<ByteArray>value.unwrap()).values) : Serialiser.serialiseResult([]);
}

/**
 * Test read method of storage
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_storage_read(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    const key = ByteArray.fromU8a(input);
    input = input.slice(key.encodedLength());
    const offset = Int32.fromU8a(input);
    input = input.slice(offset.encodedLength());

    const result = Storage.read(key.toU8a(), offset.value);
    return result.isSome() ? Serialiser.serialiseResult(<u8[]>result.unwrap()): Serialiser.serialiseResult([]);
}

/**
 * Test read method of storage
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */

export function test_storage_clear(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    Storage.clear(input);
    return Serialiser.serialiseResult([]);
}

/**
 * Test exists method of storage
 * @param data i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_storage_exists(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    const itExists = Storage.exists(input);
    return Serialiser.serialiseResult(itExists);
}
