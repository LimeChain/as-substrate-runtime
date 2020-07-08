import {Block} from '../models/block';
import {Extrinsic} from '../models/extrinsic';
import {Serialiser} from './serialiser';

/**
 * On success returns array of zero length, on failure returns Dispatch error or Apply error (tbd)
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function BlockBuilder_apply_extrinsic(data: i32, len: i32): u64 {
    const input = Serialiser.deserialise_input(data, len);
    const extrinsic = Extrinsic.fromU8Array(input);
    return Serialiser.serialise_result([]);
}