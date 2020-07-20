import { Serialiser } from "./api/serialiser";
import { Bytes } from "as-scale-codec";
import { Storage } from "./storage";

/**
 * Export the __heap_base - required by the Substrate Executor
 * IMPORTANT! - This is not the actual __heap_base constant of AS. It is used to point Subtrate Executor to write
 * it's parameters at the start of the memory, which is reserved using --memoryBase (16MB)
 */
export const __heap_base = 0;

/**
 * Export the WASM API functions
 */
export * from "./api/core";
export * from "./api/block-builder";
export * from "./api/parachain-host";
export * from "./api/grandpa-api";
export * from "./api/others";

/**
 * Dummy function for test purposes
 * @param data
 * @param len 
 */
export function test_storage(data: i32, len: i32): u64 {
    const input = Serialiser.deserialise_input(data, len);

    // Read the value passed
    const buff = new Uint8Array(input.length);
    Bytes.copyToTyped(input, buff);
    const value: string = String.UTF8.decode(buff.buffer);

    const key: string = "cool";
    Storage.set(key, value);
    return Serialiser.serialise_result(input);
}