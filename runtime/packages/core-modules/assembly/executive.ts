import { Block, Header, InherentData, Blocks } from '@as-substrate/models';
import { Timestamp } from '@as-substrate/timestamp-module';
import { Utils } from '@as-substrate/core-utils';
import { CompactInt, ByteArray } from 'as-scale-codec';
import { System } from './system';
import { Log } from './log';
import { Storage } from './storage';

export namespace Executive{
    /**
     * Calls the System function initializeBlock()
     * @param header Header instance
     */
    export function initializeBlock(header: Header): void{
        System.initialize(header);
    }

    /**
     * Performs necessary checks for Block execution
     * @param block Block instance
     */
    export function initialChecks(block: Block): void{
        let header = block.header;
        let n: CompactInt = header.number;

        const result = Storage.get(Utils.stringsToU8a(["system", "block_hash"]));
        let blockHashU8a: u8[] = result.isSome() ? (<ByteArray>result.unwrap()).values : [];
        const blockHash = Blocks.fromU8Array(blockHashU8a).result;

        if(n.value == 0 &&  blockHash.data.get(new CompactInt(n.value - 1)) == header.parentHash){
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
        // TO-DO
    }
    /**
     * Finalize the block - it is up the caller to ensure that all header fields are valid
	 * except state-root.
     */
    export function finalizeBlock(): Header {
        return System.finalize();
    }

    export function createExtrinsics(data: InherentData): u8[] {
        const timestamp: u8[] = Timestamp.createInherent(data);
        return System.ALL_MODULES.concat(timestamp);
    }

    /**
     * module hooks
     */
    export function onFinalize(): void{
        Log.printUtf8("onInitialize() called");
    }
}
