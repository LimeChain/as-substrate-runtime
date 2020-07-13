import {Extrinsic} from '../models';
import {MockBuilder} from './mock-builder';
import { UInt64 } from 'as-scale-codec';

describe("Extrinsic", () => {
    it("should instanciate default extrinsic from the SCALE encoded byte array", () => {
        const mock = MockBuilder.getDefaultExtrinsic();
        const ext = Extrinsic.fromU8Array(mock.bytes);
        assert(mock.expectedObject == ext.result, "The result Extrinsic is not the same as the expected");

        __retain(changetype<usize>(mock));
        __retain(changetype<usize>(ext));
    });
})

