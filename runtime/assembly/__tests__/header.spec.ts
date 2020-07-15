import { Header } from '../models/header';
import { MockBuilder } from './mock-builder';
import { Utils } from '../utils';

describe("Header", () => {

  it("should instanciate header from SCALE encoded Byte array", () => {
    const mock = MockBuilder.getHeaderWithoutDigestMock();
    const decodedData = Header.fromU8Array(mock.bytes);

    assert(decodedData.result == mock.instance, "header was not instanciated properly");

    __retain(changetype<usize>(mock));
    __retain(changetype<usize>(decodedData))
  });

  it("should instanciate header with digests from SCALE encoded Byte array", () => {
    const mock = MockBuilder.getHeaderWithDigestsMock();
    const decodedData = Header.fromU8Array(mock.bytes);

    assert(decodedData.result == mock.instance, "header with digests was not instanciated properly");

    __retain(changetype<usize>(mock));
    __retain(changetype<usize>(decodedData))
  });

  it("should encode header without digests correctly", () => {
    const header = MockBuilder.getHeaderWithoutDigestMock();

    assert(Utils.areArraysEqual(header.instance.toU8a(), header.bytes), "Header without digests was not encoded successfully");
    __retain(changetype<usize>(header));
  });

  it("should encode header without digests correctly", () => {
    const header = MockBuilder.getHeaderWithoutDigestMock()
    assert(Utils.areArraysEqual(header.instance.toU8a(), header.bytes), "Header without digests was not encoded successfully");
    __retain(changetype<usize>(header));
  });

  it("should encode header with digests correctly", () => {
    const header = MockBuilder.getHeaderWithDigestsMock();
    
    assert(Utils.areArraysEqual(header.instance.toU8a(), header.bytes), "Header without digests was not encoded successfully");
    __retain(changetype<usize>(header));
  });

});