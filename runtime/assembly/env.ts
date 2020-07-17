/**
 * Declaration of Polkadot Host functions exposed to the WASM Runtime
 */

/**
 * Storage: Interface for manipulating the storage from within the runtime.
*/
export declare function ext_storage_set(key: i64, value: i64): void;
export declare function ext_storage_get(key: i64): i64;

/**
 * Miscellaneous: Interface that provides miscellaneous functions for communicating between the runtime and the node
 */
export declare function print_utf8(ptr: i64): void;