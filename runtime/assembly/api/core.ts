import { Serialiser } from "./serialiser";
import { RuntimeVersion } from "../models/runtime-version";
import { ApisVec } from "../models/apis-vec";

/**
 * Returns the version data encoded in ABI format as per the specification
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function Core_version(data: i32, len: i32): u64 {

    const apis = new ApisVec();
    apis.addApi([1, 1, 1, 1, 1, 1, 1, 1], 10);
    const version = new RuntimeVersion("a", "a", 1, 1, 1, apis, 1);
    
    return Serialiser.serialise_result(version.toU8a());
}