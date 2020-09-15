import { Block, Header, InherentData, Blocks, Extrinsic, ValidTransaction, TransactionTag, TransactionError } from '@as-substrate/models';
import { Timestamp } from '@as-substrate/timestamp-module';
import { Utils } from '@as-substrate/core-utils';
import { AccountId, BalancesModule } from '@as-substrate/balances-module';
import { CompactInt, ByteArray, UInt128, Bool, UInt64 } from 'as-scale-codec';
import { u128 } from 'as-bignum';
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
     * Actually execute all transactions for Block
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
            const now: UInt64 = UInt64.fromU8a(ext.slice(5).concat([0, 0]));
            Timestamp.set(now.value);
            Timestamp.toggleUpdate();
            return [];
        }
        const extrinsic = Extrinsic.fromU8Array(ext.slice(3)).result;
        const sender: AccountId = AccountId.fromU8Array(extrinsic.from.toU8a()).result;
        const receiver: AccountId = AccountId.fromU8Array(extrinsic.to.toU8a()).result;
        BalancesModule.transfer(sender, receiver, extrinsic.amount.value);
        return [];
    }

    export function validateTransaction(source: u8[], utx: Extrinsic): u8[] {
        const from: AccountId = AccountId.fromU8Array(utx.from.toU8a()).result;
        const fromBalance = BalancesModule.getAccountData(from);

        const transfer = utx.getTransferBytes();

        if(!System.verifySignature(utx.signature, transfer, from)){
            Log.printUtf8("Transaction error: Invalid signature");
            return TransactionError.BAD_PROOF_ERROR;
        }   
        const nonce = System.accountNonce(from);
        if (<u64>nonce.value >= <u64>utx.nonce.value){
            Log.printUtf8("Transaction error: Nonce value is less than or equal to the latest nonce");
            return TransactionError.STALE_ERROR;
        }
        const balance: UInt128 = fromBalance.getFree();
        if(balance.value < u128.fromU64(utx.amount.value)){
            Log.printUtf8("Transaction error: Sender does not have enough balance");
            return TransactionError.PAYMENT_ERROR;
        } 
        /**
         * If all the validations are passed, construct validTransaction instance
         */
        const result: u8[] = [0];
        const priority: UInt64 = new UInt64(utx.toU8a().length);
        const requires: TransactionTag[] = [];
        const provides: TransactionTag[] = [new TransactionTag(from, utx.nonce)];
        const longevity: UInt64 = new UInt64(64);
        const propogate: Bool = new Bool(true);
        const validTransaction = new ValidTransaction(
            priority,
            requires,
            provides,
            longevity,
            propogate
        );
        return result.concat(validTransaction.toU8a());
    }

    /**
     * module hooks
     */
    export function onFinalize(): void{
        Log.printUtf8("onInitialize() called");
    }
}
