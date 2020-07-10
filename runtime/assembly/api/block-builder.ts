import {Block} from '../models/block';
import {Extrinsic} from '../models/extrinsic';
import {Serialiser} from './serialiser';
import { Inherent } from '../models';
import { Bool } from 'as-scale-codec';

/**
 * On success returns array of zero length, on failure returns Dispatch error or Apply error (tbd)
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function BlockBuilder_apply_extrinsics(data: i32, len: i32): u64 {
    const input = Serialiser.deserialise_input(data, len);
    const extrinsic = Extrinsic.fromU8Array(input);
    return Serialiser.serialise_result([]);
}

/**
 * 
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */

export function BlockBuilder_inherent_extrinsics(data: i32, len: i32): u64 {
    const input = Serialiser.deserialise_input(data, len);
    const inherent = Inherent.fromU8Array(input);
    return Serialiser.serialise_result(inherent.toU8a());
}

/**
 * Upon succesfull validation of Block's fields, appends the block to the chain
 * Mocked to return true in this iteration
 */

export function BlockBuilder_finalize_block(data: i32, len: i32): u64 {
    return Serialiser.serialise_result((new Bool(true)).toU8a());
}

/**
 * Validates fields of the InherentData and sends back okay or error message with failed Inherents
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function BlockBuilder_check_inherents(data: i32, len: i32): u64 {
    return Serialiser.serialise_result((new Bool(true)).toU8a());
}

/**
 * Generates random seed, returns Block object
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */

export function BlockBuilder_random_seed(data: i32, len: i32): u64 {
    return Serialiser.serialise_result([]);
}



