import { Extrinsic } from '@as-substrate/models';
import { MockBuilder } from './mock-builder';
describe("Extrinsic", () => {
    it("should instanciate default extrinsic from the SCALE encoded byte array", () => {
        const mock = MockBuilder.getDefaultExtrinsic();
        const ext = Extrinsic.fromU8Array(mock.bytes);
        assert(mock.instance == ext.result, "The result Extrinsic is not the same as the expected");
    });
    throws("Extrinsic: Invalid bytes provided. EOF", () => {
        const mock = MockBuilder.getInvalidExtrinsic();
        Extrinsic.fromU8Array(mock);
    })
})

