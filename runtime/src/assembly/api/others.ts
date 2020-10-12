/**
 * The rest of runtime entries for the Polkadot Host
 * These methods are mocked for this iteration and they return an empty u8 array by default
 */
import {Serialiser} from "@as-substrate/core-utils";
import { Extrinsic, SignedTransaction } from '@as-substrate/models';
import { AccountId } from '@as-substrate/balances-module';
import { Executive, System } from '@as-substrate/core-modules';

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
 * Receives encoded byte array of Extrinsic appended to the source of transaction
 * Returns ValidTransaction or TransactionError code
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 * source: TransactionSource, utx: Block::Extrinsic
 * len + source + ext
 */
export function TaggedTransactionQueue_validate_transaction(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    const uxt = Extrinsic.fromU8Array(input);
    const result = Executive.validateTransaction(<SignedTransaction>uxt.result);
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

/**
 * Get the latest nonce for the account
 * @param data 
 * @param len 
 */
export function System_account_nonce(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const who = AccountId.fromU8Array(input).result;
    const nonce = System.accountNonce(who);
    return Serialiser.serialiseResult(nonce.toU8a());
}