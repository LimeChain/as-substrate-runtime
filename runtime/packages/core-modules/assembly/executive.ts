import { Block, Header, InherentData, Blocks, Extrinsic, ValidTransaction, TransactionTag } from '@as-substrate/models';
import { Timestamp } from '@as-substrate/timestamp-module';
import { Utils } from '@as-substrate/core-utils';
import { AccountId, BalancesModule } from '@as-substrate/balances-module';
import { CompactInt, ByteArray, UInt128, Bool, UInt64 } from 'as-scale-codec';
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
    /**
     * creates inherents from internal modules
     * @param data inherents
     */
    export function createExtrinsics(data: InherentData): u8[] {
        const timestamp: u8[] = Timestamp.createInherent(data);
        return System.ALL_MODULES.concat(timestamp);
    }

    /**
     * Apply Extrinsics
     * @param ext extrinsic
     */
    export function applyExtrinsic(ext: u8[]): u8[] {
        const encodedLen = ext.length;
        return Executive.applyExtrinsicWithLen(ext, encodedLen);
    }
    
    /**
     * 
     * @param ext extrinsic
     * @param encodedLen length
     * @param encoded encoded extrinsic
     */
    export function applyExtrinsicWithLen(ext: u8[], encodedLen: u32): u8[]{
        // if the length of the encoded extrinsic is less than 144, it's inherent
        // in our case, we have only timestamp inherent
        if(encodedLen < 144){
            // inherent comes without
            const now: UInt64 = UInt64.fromU8a(ext.slice(5).concat([0, 0]));
            Log.printUtf8("setting timestamp: " + now.toU8a().toString());
            Timestamp.set(now.value);
            return [];
        }
        const extrinsic = Extrinsic.fromU8Array(ext.slice(3)).result;
        const sender: AccountId = AccountId.fromU8Array(extrinsic.from.toU8a()).result;
        const receiver: AccountId = AccountId.fromU8Array(extrinsic.to.toU8a()).result;
        BalancesModule.transfer(sender, receiver, extrinsic.amount.value);
        Log.printUtf8("done transfering: " + extrinsic.toU8a().toString());
        return [];
    }

    export function validateTransaction(source: u8[], utx: Extrinsic): u8[] {
        const from: AccountId = AccountId.fromU8Array(utx.from.toU8a()).result;
        const to: AccountId = AccountId.fromU8Array(utx.to.toU8a()).result;
        const fromBalance = BalancesModule.getAccountData(from);

        const transfer = utx.getTransferBytes();

        if(!System.verifySignature(utx.signature, transfer, from)){
            throw new Error("Invalid signature");
        }   
        const nonce = System.accountNonce(from);
        if (<u64>nonce.value >= <u64>utx.nonce.value){
            throw new Error("Nonce value is less than or equal to the latest nonce");
        }
        const balance: UInt128 = fromBalance.getFree();
        // if(balance.value < u128.fromU64(utx.amount.value)){
        //     throw new Error("Sender does not have enough balance");
        // } 

        const priority: UInt64 = UInt64.fromU8a([1, 0, 0, 0, 0, 0, 0, 0]);
        const requires: TransactionTag[] = [];
        const provides: TransactionTag[] = [new TransactionTag(from, utx.nonce)];
        const longevity: UInt64 = new UInt64(1000000);
        const propogate: Bool = new Bool(true);
        const validTransaction = new ValidTransaction(
            priority,
            requires,
            provides,
            longevity,
            propogate
        );
        const option: u8[] = [0];
        return option.concat(validTransaction.toU8a());
    }

    /**
     * module hooks
     */
    export function onFinalize(): void{
        Log.printUtf8("onInitialize() called");
    }
}
