import { Header } from '../models/header';
import { MockBuilder } from './mock-builder';
import { Hash, CompactInt } from 'as-scale-codec';
import { Option, DigestItem } from '../models';
import { Utils } from '../utils';
import { MockConstants } from './mock-constants';

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
    const hash69 = Hash.fromU8a([69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69]);
    const hash255 = Hash.fromU8a([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]);
    const blockNumber = new CompactInt(1);
    const digest = new Option<DigestItem[]>(null);
    const header = new Header(hash69, blockNumber, hash255, hash255, digest);

    assert(Utils.areArraysEqual(header.toU8a(), MockConstants.HEADER_WITHOUT_DIGEST), "Header without digests was not encoded successfully");
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