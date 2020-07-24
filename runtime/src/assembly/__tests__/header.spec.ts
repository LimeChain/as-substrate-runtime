import { Header } from '@as-substrate/models';
import { MockBuilder } from './mock-builder';
import { Utils } from '@as-substrate/core-utils';

describe("Header", () => {

  it("should instanciate header from SCALE encoded Byte array", () => {
    const mock = MockBuilder.getHeaderWithoutDigestMock();
    const decodedData = Header.fromU8Array(mock.bytes);

    assert(decodedData.result == mock.instance, "header was not instanciated properly");
  });

  it("should instanciate header with digests from SCALE encoded Byte array", () => {
    const mock = MockBuilder.getHeaderWithDigestsMock();
    const decodedData = Header.fromU8Array(mock.bytes);

    assert(decodedData.result == mock.instance, "header with digests was not instanciated properly");
  });

  it("should encode header without digests correctly", () => {
    const header = MockBuilder.getHeaderWithoutDigestMock();

    assert(Utils.areArraysEqual(header.instance.toU8a(), header.bytes), "Header without digests was not encoded successfully");
  });

  it("should encode header without digests correctly", () => {
    const header = MockBuilder.getHeaderWithoutDigestMock()
    assert(Utils.areArraysEqual(header.instance.toU8a(), header.bytes), "Header without digests was not encoded successfully");
  });

  it("should encode header with digests correctly", () => {
    const header = MockBuilder.getHeaderWithDigestsMock();
    
    assert(Utils.areArraysEqual(header.instance.toU8a(), header.bytes), "Header without digests was not encoded successfully");
  });

});