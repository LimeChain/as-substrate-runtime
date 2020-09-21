/**
 * Declaration of Polkadot Host functions exposed to the WASM Runtime
 * Copied from "https://github.com/paritytech/as-substrate/blob/master/packages/as-runtime/assembly/env.ts"
 */

/** 
 * Allocator: Provides functionality for calling into the memory allocator.
*/
export declare function ext_allocator_free_version_1(ptr: i32): void;
export declare function ext_allocator_malloc_version_1(size: i32): i32;

/**
 * Crypto: Interfaces for working with crypto related types from within the runtime.
*/
export declare function ext_crypto_ed25519_generate_version_1(key_type_id: i32, seed: i64): i32;
export declare function ext_crypto_ed25519_verify_version_1(sig: i32, msg: i64, key: i32): i32;
export declare function ext_crypto_secp256k1_ecdsa_recover_compressed_version_1(sig: i32, msg: i32): i64;
export declare function ext_crypto_secp256k1_ecdsa_recover_version_1(sig: i32, msg: i32): i64;
export declare function ext_crypto_sr25519_generate_version_1(key_type_id: i32, seed: i64): i32;
export declare function ext_crypto_sr25519_public_keys_version_1(key_type_id: i64): i64;
export declare function ext_crypto_sr25519_sign_version_1(key_type_id: i32, key: i32, msg: i64): i64;
export declare function ext_crypto_sr25519_verify_version_1(sig: i32, msg: i64, key: i32): i32;
export declare function ext_crypto_sr25519_verify_version_2(sig: i32, msg: i64, key: i32): i32;

/**
 * Hashing: Interface that provides functions for hashing with diﬀerent algorithms.
*/
export declare function ext_hashing_blake2_128_version_1(data: i64): i32;
export declare function ext_hashing_blake2_256_version_1(data: i64): i32;
export declare function ext_hashing_keccak_256_version_1(data: i64): i32;
export declare function ext_hashing_twox_128_version_1(data: i64): i32;
export declare function ext_hashing_twox_64_version_1(data: i64): i32;

/**
 * Log: Request to print a log message on the host. Note that this will be
 * only displayed if the host is enabled to display log messages with given level and target.
*/
export declare function ext_logging_log_version_1(level: i32, target: i64, message: i64): void;

/**
 * Miscellaneous: Interface that provides miscellaneous functions for communicating between the runtime and the node.
*/
export declare function ext_misc_print_hex_version_1(data: i64): void;
export declare function ext_misc_print_num_version_1(value: i64): void;
export declare function ext_misc_print_utf8_version_1(data: i64): void;
export declare function ext_misc_runtime_version_version_1(data: i64): i64;

/**
 * Storage: Interface for manipulating the storage from within the runtime.
*/
export declare function ext_storage_changes_root_version_1(parent_hash: i64): i64;
export declare function ext_storage_clear_prefix_version_1(prefix: i64): void;
export declare function ext_storage_clear_version_1(key_data: i64): void;
export declare function ext_storage_get_version_1(key: i64): i64;
export declare function ext_storage_next_key_version_1(key: i64): i64;
export declare function ext_storage_read_version_1(key: i64, value_out: i64, offset: i32): i64;
export declare function ext_storage_root_version_1(): i64;
export declare function ext_storage_set_version_1(key: i64, value: i64): void;
export declare function ext_storage_exists_version_1(key: i64): i32;
/**
 * Trie: Interface that provides trie related functionality
 */
export declare function ext_trie_blake2_256_ordered_root_version_1(data: i64): i32;