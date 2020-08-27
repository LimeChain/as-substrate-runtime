import { Serialiser } from "@as-substrate/core-utils";
import { RuntimeVersion, SupportedAPIs, Block, Header } from "@as-substrate/models";
import { Executive } from '@as-substrate/core-modules';
import { Bool } from "as-scale-codec";

/**
 * Returns the version data encoded in ABI format as per the specification
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function Core_version(data: i32, len: i32): u64 {
    const version = getRuntimeVersionConfig();
    return Serialiser.serialiseResult(version.toU8a());
}

/**
 * Executes a full block by executing all exctrinsics included in it and update state accordingly.
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function Core_execute_block(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const block = Block.fromU8Array(input);
    Executive.executeBlock(block.result);
    return Serialiser.serialiseResult((new Bool(true)).toU8a()); // Return mocked `true`
}

/**
 * Initializes the Block instance from the passed argument
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length ( in bytes ) of the arguments passed
 */

export function Core_initialize_block(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const header = Header.fromU8Array(input);
    Executive.initializeBlock(header.result);
    return Serialiser.serialiseResult([]);
}

/**
 * Instanciates new RuntimeVersion Configration
 */
function getRuntimeVersionConfig(): RuntimeVersion {
    const SPEC_NAME: string = "node-template";
    const IMPL_NAME: string = "AssemblyScript"
    const AUTHORING_VERSION: u32 = 1;
    const SPEC_VERSION: u32 = 1;
    const IMPL_VERSION: u32 = 1;

    const APIS_VEC: SupportedAPIs = new SupportedAPIs();
    APIS_VEC.addAPI([1, 1, 1, 1, 1, 1, 1, 1], 10);
    
    const TRANSACTION_VERSION: u32 = 1;

    return new RuntimeVersion(
        SPEC_NAME,
        IMPL_NAME,
        AUTHORING_VERSION,
        SPEC_VERSION,
        IMPL_VERSION,
        APIS_VEC,
        TRANSACTION_VERSION
    );
}