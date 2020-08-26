import { Block } from '@as-substrate/models';
import { System } from './system';
import { CompactInt, ByteArray } from 'as-scale-codec';
import { Log } from './log';
import { Storage } from './storage';
import { Helpers } from './helpers';
export namespace Executive{
    /**
     * Calls the System function initializeBlock()
     * @param header Header instance
     */
    export function initializeBlock(header: u8[]): void{
        System.initialize(header);
    }

    /**
     * Performs necessary checks for Block execution
     * @param block Block instance
     */
    export function initialChecks(block: Block): void{
        let header = block.header;
        let n: CompactInt = header.number;

        const result = Storage.get(Helpers.stringsToU8a(["system", "block_hash"]));
        let blockHashU8a: u8[] = result.isSome() ? (<ByteArray>result.unwrap()).values : [];
        const blockHash = Helpers.blockHashFromU8Array(blockHashU8a);

        if(n.value == 0 &&  blockHash.get(new CompactInt(n.value - 1)) == header.parentHash){
            throw new Error("Parent hash should be valid.");
        }
    }

    /**
     * Actually execute all transitions for Block
     * @param block Block instance
     */
    export function executeBlock(block: Block): void{
        Executive.initializeBlock(block.header.toU8a());
        Executive.initialChecks(block);
        let header = block.header;
        // TO-DO
    }
    /**
     * Finalize the block - it is up the caller to ensure that all header fields are valid
	 * except state-root.
     */
    export function finalizeBlock(): u8[] {
        return System.finalize();
    }

    /**
     * module hooks
     */
    export function onFinalize(): void{
        Log.printUtf8("onInitialize() called");
    }
}
