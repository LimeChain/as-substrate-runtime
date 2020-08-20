import { Header, Block } from '@as-substrate/models';
import { System } from './system';
import { CompactInt } from 'as-scale-codec';
import { Log } from './log';
export namespace Executive{
    /**
     * Calls the System function initializeBlock()
     * @param header Header instance
     */
    export function initializeBlock(header: Header): void{
        System.initializeBlock(header);
    }

    /**
     * Performs necessary checks for Block execution
     * @param block Block instance
     */
    export function initialChecks(block: Block): void{
        let header = block.header;
        let n: CompactInt = header.number;
        if(n.value == 0 && System.blockHash.get(n.value - 1) == header.parent_hash){
            throw new Error("Parent hash should be valid.");
        }

    }

    /**
     * Actually execute all transitions for Block
     * @param block Block instance
     */
    export function executeBlock(block: Block): void{
        Executive.initializeBlock(block.header);
        Executive.initialChecks(block);
        let header = block.header;
        let extrinsics = block.extrinsics;
    }
    /**
     * Finalize the block - it is up the caller to ensure that all header fields are valid
	 * except state-root.
     */
    export function finalizeBlock(): Header {
        return System.finalize();
    }

    /**
     * module hooks
     */
    export function onFinalize(): void{
        Log.printUtf8("onInitialize() called");
    }
}