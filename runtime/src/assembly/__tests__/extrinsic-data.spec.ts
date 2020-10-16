import { ExtrinsicData } from '@as-substrate/models';
import { MockBuilder } from './mock-builder';
import { MockConstants } from './mock-constants';
import { Utils } from '@as-substrate/core-utils';

describe("Exrinisc data", () => {
    it("correctly encodes/decodes ExtrinsicData ", () => {
        const mock = MockBuilder.getExtrinsicDataMock();
        const obj = ExtrinsicData.fromU8Array(mock.bytes);
        assert(obj.result == mock.instance, "The result ExtrinsicData is not the same as the expected");
    })
    it("returns enumerated values", () => {
        const mock = MockBuilder.getExtrinsicDataMock();
        const enumeratedValues = MockConstants.EXTRINSIC_DATA_ENUMERATED_VALUES;
        assert(Utils.areArraysEqual(mock.instance.toEnumeratedValues(), enumeratedValues), "Enumerated values are different");
    })
})