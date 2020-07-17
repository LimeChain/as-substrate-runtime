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
 * Export the HOST API functions
 */
export * from './storage';