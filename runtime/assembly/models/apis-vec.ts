import { ByteArray, UInt32, Byte } from "as-scale-codec";
import { CompactInt } from "as-scale-codec";

/**
 * Vector of pairs of`ApiId` and a`u32` for version
 */
export class ApisVec {

    private apis: Map<u8[], UInt32>

    constructor() {
        this.apis = new Map<u8[], UInt32>();
    }

    addApi(apiId: u8[], version: u32): void {
        this.apis.set(apiId,new UInt32(version));
    }

    toU8a(): u8[] {
        
        const keys = this.apis.keys();
        const values = this.apis.values();

        let result = new Array<u8>();
        // Encode the length
        result = result.concat(new CompactInt(this.apis.size).toU8a());
        for (let i = 0; i < this.apis.size; i++) {
            result = result.concat(keys[i]);
            result = result.concat(values[i].toU8a());
        }
        return result;
    }

}