import { InherentData } from '../models';
import { MockBuilder } from './mock-builder';
import { MockResult } from './mock-result';

describe("Inherent", () => {
    it("Should instanciate new Inherent class from the empty SCALE Encoded Array", () => {
        const mock: MockResult<InherentData> = MockBuilder.getInherentMock();
        const decodedData = InherentData.fromU8Array(mock.bytes);
        assert(decodedData.result == mock.instance, "Expected object is not equal to the newly instanciated object");
        __retain(changetype<usize>(mock));
        __retain(changetype<usize>(decodedData));
    })
})
