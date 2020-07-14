import { Block } from "../models";
import { MockBuilder } from "./mock-builder";

describe("Block", () => {

  it("should instanciate empty block from SCALE encoded Byte array", () => {
    const mock = MockBuilder.getEmptyBlockMock();
    const block = Block.fromU8Array(mock.bytes);
    assert(block.result == mock.expectedObject, "empty block was not instanciated properly");

    __retain(changetype<usize>(mock));
    __retain(changetype<usize>(block))
  });

  it("should instanciate block with extrinsic from SCALE encoded Byte array", () => {
    const mock = MockBuilder.getBlockWithExtrinsics();
    const block = Block.fromU8Array(mock.bytes);
    assert(block.result.body.length == 2, "Extrinciscs were not instanciated properly");
    assert(block.result == mock.expectedObject, "block with extrinsic was not instanciated properly");
    assert(block.result.header == mock.expectedObject.header, "header part of the block object was not instanciated properly");
    assert(block.result.body[0] == mock.expectedObject.body[0], "Extrinsic was not instanciated properly");
    assert(block.result.body[1] == mock.expectedObject.body[1], "Extrinsic was not instanciated properly");

    __retain(changetype<usize>(mock));
    __retain(changetype<usize>(block))
  });

  it("should instanciate block with extrinsic and header digest from  SCALE Encoded Byte Array", () => {
    //TODO;
  });

});
