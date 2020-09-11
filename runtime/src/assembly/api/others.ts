/**
 * The rest of runtime entries for the Polkadot Host
 * These methods are mocked for this iteration and they return an empty u8 array by default
 */
import {Serialiser} from "@as-substrate/core-utils";
import { Extrinsic } from '@as-substrate/models';
import { Executive, Log } from '@as-substrate/core-modules';
import { CompactInt } from "as-scale-codec";

/**
 * 
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function BabeApi_configuration(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}

/**
 * 
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function SessionKeys_generate_session_keys(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}

/**
 * 
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function TaggedTransactionQueue_validate_transaction(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    const size = CompactInt.fromU8a(input);
    input = input.slice(size.encodedLength());
    const source = input.slice(0, 1);
    input = input.slice(1);
    Log.printUtf8("calling transaction validation...: " + input.toString());
    const uxt = Extrinsic.fromU8Array(input);
    Log.printUtf8("after ext decoding");
    const result = Executive.validateTransaction(source, uxt.result);
    Log.printUtf8("after validation: " + result.toString());
    return Serialiser.serialiseResult(result);
}

/**
 * 
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function OffchainWorkerApi_offchain_worker(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}

/**
 * 
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function Metadata_metadata(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}
