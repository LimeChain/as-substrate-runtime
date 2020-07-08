import { Header } from '../models/header';
import { MockBuilder } from './mock-builder';


describe("Header", () => {

  it("should instanciate header from SCALE encoded Byte array", () => {
    const mock = MockBuilder.getHeaderWithoutDigestMock();
    const decodedData = Header.fromU8Array(mock.bytes);

    assert(decodedData.result == mock.expectedObject, "header was not instanciated properly");

    __retain(changetype<usize>(mock));
    __retain(changetype<usize>(decodedData))
  });

});