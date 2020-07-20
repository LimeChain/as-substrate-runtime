/**
 * Temporary test functions for the Storage module
 */
import { Storage } from '../../modules/storage';
import { Serialiser } from '../serialiser';
import { ScaleString } from 'as-scale-codec';

/**
 * Test get method of storage
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_storage_set(data: i32, len: i32): i64 {
    let input = Serialiser.deserialise_input(data, len);
    const key = ScaleString.fromU8a(input);
    input = input.slice(key.encodedLength());
    const value = ScaleString.fromU8a(input);    
    input = input.slice(value.encodedLength());
    Storage.set(key.valueStr, value.valueStr);
    return Serialiser.serialise_result(input);
}

/**
 * Test set method of storage
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_storage_get(data: i32, len: i32): i64 {
    let input = Serialiser.deserialise_input(data, len);
    const key = ScaleString.fromU8a(input);
    const value = Storage.get(key.valueStr);
    return Serialiser.serialise_result(value);
}