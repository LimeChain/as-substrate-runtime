import { MockResult } from "./mock-result";
import { Block, Option, Header } from "../models";
import { Hash, CompactInt } from "as-scale-codec";

/**
 * Namespace used to return SCALE encoded byte inputs and the appropriate native instance of the object
 */
export namespace MockBuilder {

    /**
     * Returns SCALE Encoded Empty Block mock and instance of that block
     */
    export function getEmptyBlockMock(): MockResult<Block> {
        const EMPTY_BLOCK: u8[] = [
            69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69,
            4,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            0,
            0
        ];
        
        const hash69 = Hash.fromU8a([69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69]);
        const hash255 = Hash.fromU8a([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]);
        const blockNumber = new CompactInt(1);
        const digest = new Option<Hash>(null);
        const header = new Header(hash69, blockNumber, hash255, hash255, digest);
        const block = new Block(header);

        return new MockResult(block, EMPTY_BLOCK);
    }

}