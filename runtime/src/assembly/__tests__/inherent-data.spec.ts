import { InherentData } from '@as-substrate/models';
import { MockBuilder } from './mock-builder';
import { MockResult } from './mock-result';
import { Utils } from '@as-substrate/core-utils';
import { ByteArray } from 'as-scale-codec';

describe("Inherent", () => {
    it("Should instanciate new Inherent class from the empty SCALE Encoded Array", () => {
        const mock: MockResult<InherentData> = MockBuilder.getInherentDataMock();
        const decodedData = InherentData.fromU8Array(mock.bytes);
        assert(decodedData.result == mock.instance, "Expected object is not equal to the newly instanciated object");
    })
    it("Should encode InherentData correctly", () => {
        const mock: MockResult<InherentData> = MockBuilder.getInherentDataMock();
        assert(Utils.areArraysEqual(mock.instance.toU8a(), mock.bytes), "Encoded InherentData instance is not equal to the expected bytes");
    })

    throws("InherentData: Key length should be equal to 8!", () => {
        const data: Map<string, ByteArray> = MockBuilder.getInvalidDataMap();
        const inherent = new InherentData(data);
    })
})
