import { Block } from "@as-substrate/models";
import { MockBuilder } from "./mock-builder";
import { Utils } from "@as-substrate/core-utils";

describe("Block", () => {

  it("should instanciate empty block from SCALE encoded Byte array", () => {
    const mock = MockBuilder.getEmptyBlockMock();
    const block = Block.fromU8Array(mock.bytes);
    assert(block.result == mock.instance, "empty block was not instanciated properly");
  });

  it("should instanciate block with extrinsic from SCALE encoded Byte array", () => {
    const mock = MockBuilder.getBlockWithExtrinsics();
    const block = Block.fromU8Array(mock.bytes);
    assert(block.result.body.length == 3, "Extrinciscs were not instanciated properly");
    assert(block.result == mock.instance, "block with extrinsic was not instanciated properly");
    assert(block.result.header == mock.instance.header, "header part of the block object was not instanciated properly");
    assert(block.result.body[0] == mock.instance.body[0], "Extrinsic was not instanciated properly");
    assert(block.result.body[1] == mock.instance.body[1], "Extrinsic was not instanciated properly");
    assert(block.result.body[2] == mock.instance.body[2], "Inherent instance was not instanciated properly");
  });

  it("should instanciate block with extrinsics and header digests from  SCALE Encoded Byte Array", () => {
    const mock = MockBuilder.getBlockWithExtrinsicsAndDigests();
    const block = Block.fromU8Array(mock.bytes);
    assert(block.result == mock.instance, "block with extrinsic and digests was not instanciated properly");
  });

  it("should encode block without digests correctly", () => {
    const block = MockBuilder.getBlockWithExtrinsics();
    assert(Utils.areArraysEqual(block.instance.toU8a(), block.bytes), "Block without digests was not encoded successfully");
  });

  it("should encode block with digests correctly", () => {
    const block = MockBuilder.getBlockWithExtrinsicsAndDigests();
    assert(Utils.areArraysEqual(block.instance.toU8a(), block.bytes), "Block with digests was not encoded successfully");
  });
});