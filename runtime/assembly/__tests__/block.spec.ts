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

  it("should instanciate block from SCALE encoded Byte array", () => {
    const mock = MockBuilder.getBlockWithExtrinsic();
    const block = Block.fromU8Array(mock.bytes);

    assert(block.result == mock.expectedObject, "block with extrinsic was not instanciated properly");

    __retain(changetype<usize>(mock));
    __retain(changetype<usize>(block))
  });

});
