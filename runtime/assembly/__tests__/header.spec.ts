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

  it("should instanciate header with digests from SCALE encoded Byte array", () => {
    const mock = MockBuilder.getHeaderWithDigestsMock();
    const decodedData = Header.fromU8Array(mock.bytes);

    assert(decodedData.result == mock.expectedObject, "header with digests was not instanciated properly");

    __retain(changetype<usize>(mock));
    __retain(changetype<usize>(decodedData))
  });

});