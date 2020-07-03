import { ScaleString, UInt32 } from "as-scale-codec";
import { SupportedAPIs } from ".";


/**
 * Version module for the Substrate runtime
 */
export class RuntimeVersion {

    /**
     * Identifies the different runtimes
     */
    private specName: ScaleString

    /**
     * Name of the implementation of the spec. This is of little consequence for the node
	 * and serves only to differentiate code of different implementation teams.
     * For this implementation you could identify the `impl_name` with AssemblyScript f.e
     */
    private implName: ScaleString

    /**
     * `authoring_version` is the version of the authorship interface
     */
    private authoringVersion: UInt32

    /**
     * Version of the runtime specification.A full - node will not attempt to use its native
	 * runtime in substitute for the on-chain Wasm runtime unless all of `spec_name`,
	 * `spec_version` and `authoring_version` are the same between Wasm and native.
     */
    private specVersion: UInt32

    /**
     * Version of the implementation of the specification. Nodes are free to ignore this; it
	 * serves only as an indication that the code is different; as long as the other two versions
	 * are the same then while the actual code may be different, it is nonetheless required to
	 * do the same thing.
	 * Non-consensus-breaking optimizations are about the only changes that could be made which
	 * would result in only the `impl_version` changing.
     */
    private implVersion: UInt32

    /**
     * List of supported API "features" along with their versions
     */
    private apis: SupportedAPIs

    /**
     * All existing dispatches are fully compatible when this number doesn't change. If this
     * number changes, then `spec_version` must change, also.
     */
    private transactionVersion: UInt32

    constructor(specName: string, implName: string, authoringVersion: u32, specVersion: u32, implVersion: u32, apis: SupportedAPIs, transactionVersion: u32) {
        this.specName = new ScaleString(specName);
        this.implName = new ScaleString(implName);
        this.authoringVersion = new UInt32(authoringVersion);
        this.specVersion = new UInt32(specVersion);
        this.implVersion = new UInt32(implVersion);
        this.apis = apis;
        this.transactionVersion = new UInt32(transactionVersion);
    }

    /**
     * SCALE Encodes the RuntimeVersion into u8[]
     */
    toU8a(): u8[] {
        return this.specName.toU8a()
            .concat(this.implName.toU8a())
            .concat(this.authoringVersion.toU8a())
            .concat(this.specVersion.toU8a())
            .concat(this.implVersion.toU8a())
            .concat(this.apis.toU8a())
            .concat(this.transactionVersion.toU8a())
    }

}
