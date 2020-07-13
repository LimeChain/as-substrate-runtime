import { Inherent } from '../models';
import { MockBuilder } from './mock-builder';
import { MockResult } from './mock-result';

describe("Inherent", () => {
    it("Should instanciate new Inherent class from the empty SCALE Encoded Array", () => {
        const mock: MockResult<Inherent> = MockBuilder.getInherentMock();
        const decodedData = Inherent.fromU8Array(mock.bytes);

        expect(decodedData == mock.expectedObject).toBeTruthy();
        __retain(changetype<usize>(mock));
        __retain(changetype<usize>(decodedData));
    })
})