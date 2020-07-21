/**
 * Temporary test functions for the Storage module
 */
import { Storage } from '../../modules/storage';
import { Serialiser } from '../serialiser';
import { ByteArray } from 'as-scale-codec';

/**
 * Test get method of storage
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_storage_set(data: i32, len: i32): i64 {
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
export function test_storage_get(data: i32, len: i32): i64 {
    let input = Serialiser.deserialiseInput(data, len);
    const key = ByteArray.fromU8a(input);
    const value = Storage.get(key.toU8a());
    return value.isSome() ? Serialiser.serialiseResult(<u8[]>value.value) : Serialiser.serialiseResult([]);
}