import { Serialiser } from '@as-substrate/core-utils';
import { InherentData, Extrinsic } from '@as-substrate/models';
import { Executive } from '@as-substrate/core-modules';
import { Bool } from 'as-scale-codec';

/**
 * On success returns array of zero length, on failure returns Dispatch error or Apply error (tbd)
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function BlockBuilder_apply_extrinsics(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const extrinsic = Extrinsic.fromU8Array(input);
    return Serialiser.serialiseResult([]);
}

/**
 * On success, returns an empty array
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */

export function BlockBuilder_inherent_extrinsics(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const inherent = InherentData.fromU8Array(input);
    return Serialiser.serialiseResult([0]);
}

/**
 * Upon succesfull validation of Block's fields, appends the block to the chain
 * Mocked to return true in this iteration
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */

export function BlockBuilder_finalize_block(data: i32, len: i32): u64 {
    const header = Executive.finalizeBlock();
    return Serialiser.serialiseResult(header.toU8a());
}

/**
 * Validates fields of the InherentData and sends back okay or error message with failed InherentDatas
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function BlockBuilder_check_inherents(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult((new Bool(true)).toU8a());
}

/**
 * Generates random seed, returns Block object
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */

export function BlockBuilder_random_seed(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}



