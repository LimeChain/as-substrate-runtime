import { ScaleString, UInt32 } from "as-scale-codec";
import { ApisVec } from "./apis-vec";


/**
 * Version module for the Substrate runtime
 */
export class RuntimeVersion {

    /**
     * Identifies the different runtimes
     */
    private spec_name: ScaleString

    /**
     * Name of the implementation of the spec. This is of little consequence for the node
	 * and serves only to differentiate code of different implementation teams.
     * For this implementation you could identify the `impl_name` with AssemblyScript f.e
     */
    private impl_name: ScaleString

    /**
     * `authoring_version` is the version of the authorship interface
     */
    private authoring_version: UInt32

    /**
     * Version of the runtime specification.A full - node will not attempt to use its native
	 * runtime in substitute for the on-chain Wasm runtime unless all of `spec_name`,
	 * `spec_version` and `authoring_version` are the same between Wasm and native.
     */
    private spec_version: UInt32

    /**
     * Version of the implementation of the specification. Nodes are free to ignore this; it
	 * serves only as an indication that the code is different; as long as the other two versions
	 * are the same then while the actual code may be different, it is nonetheless required to
	 * do the same thing.
	 * Non-consensus-breaking optimizations are about the only changes that could be made which
	 * would result in only the `impl_version` changing.
     */
    private impl_version: UInt32

    /**
     * List of supported API "features" along with their versions
     */
    private apis: ApisVec

    /**
     * All existing dispatches are fully compatible when this number doesn't change. If this
     * number changes, then `spec_version` must change, also.
     */
    private transaction_version: UInt32

    constructor(specName: string, implName: string, authoringVersion: u32, specVersion: u32, implVersion: u32, apis: ApisVec, transactionVersion: u32) {
        this.spec_name = new ScaleString(specName);
        this.impl_name = new ScaleString(implName);
        this.authoring_version = new UInt32(authoringVersion);
        this.spec_version = new UInt32(specVersion);
        this.impl_version = new UInt32(implVersion);
        this.apis = apis;
        this.transaction_version = new UInt32(transactionVersion);
    }

    /**
     * SCALE Encodes the RuntimeVersion into u8[]
     */
    toU8a(): u8[] {
        return this.spec_name.toU8a()
            .concat(this.impl_name.toU8a())
            .concat(this.authoring_version.toU8a())
            .concat(this.spec_version.toU8a())
            .concat(this.impl_version.toU8a())
            .concat(this.apis.toU8a())
            .concat(this.transaction_version.toU8a())
    }

}
