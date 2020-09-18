import { 
    Block, Header, 
    InherentData, Blocks, 
    Extrinsic, Inherent, 
    ValidTransaction, TransactionTag, 
    TransactionError, ApplyExtrinsicResult
} from '@as-substrate/models';
import { Timestamp } from '@as-substrate/timestamp-module';
import { AuraModule } from '@as-substrate/aura-module';
import { Utils } from '@as-substrate/core-utils';
import { AccountId, BalancesModule } from '@as-substrate/balances-module';
import { CompactInt, ByteArray, UInt128, Bool, UInt64, Bytes } from 'as-scale-codec';
import { System, Log, Storage, Crypto } from '.';

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
            Log.error("Initial checks: Parent hash should be valid.");
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
        const timestamp: Inherent = Timestamp.createInherent(data);
        const aura = AuraModule.createInherent(data);
        if(aura.isSome()){
            return System.ALL_MODULES.concat(timestamp.toU8a()).concat((<Inherent>aura.unwrap()).toU8a());
        }
        return System.ALL_MODULES.concat(timestamp.toU8a());
    }

    /**
     * Apply Extrinsics
     * @param ext extrinsic
     */
    export function applyExtrinsic(ext: u8[]): u8[] {
        const encodedLen = Bytes.decodeCompactInt(ext);
        return Executive.applyExtrinsicWithLen(ext, encodedLen.value as u32);
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
        if(Inherent.isInherent(ext)){
            const inherent = Inherent.fromU8Array(ext).result;
            Timestamp.applyInherent(inherent);
            return ApplyExtrinsicResult.SUCCESS;
        }
        const cmpLen = Bytes.decodeCompactInt(ext);
        ext = ext.slice(cmpLen.decBytes);
        const result = ext.shift();
        if (result as bool){
            const extrinsic = Extrinsic.fromU8Array(ext).result;
            BalancesModule.applyExtrinsic(extrinsic);
            return ApplyExtrinsicResult.SUCCESS;
        }
        return ApplyExtrinsicResult.CALL_ERROR;
    }

    /**
     * Initial transaction validation
     * @param source source of the transaction (external, inblock, etc.)
     * @param utx transaction
     */
    export function validateTransaction(source: u8[], utx: Extrinsic): u8[] {
        const from: AccountId = AccountId.fromU8Array(utx.from.toU8a()).result;
        const fromBalance = BalancesModule.getAccountData(from);
        const transfer = utx.getTransferBytes();

        if(!Crypto.verifySignature(utx.signature, transfer, from)){
            Log.error("Validation error: Invalid signature");
            return TransactionError.INVALID_SIGNATURE;
        }   
        const nonce = System.accountNonce(from);
        if (<u64>nonce.value >= <u64>utx.nonce.value){
            Log.error("Validation error: Nonce value is less than or equal to the latest nonce");
            return TransactionError.NONCE_TOO_LOW;
        }
        const balance: UInt128 = fromBalance.getFree();
        if(!BalancesModule.validateTransaction(utx)){
            Log.error("Validation error: Sender does not have enough balance");
            return TransactionError.INSUFFICIENT_BALANCE;
        }

        /**
         * If all the validations are passed, construct validTransaction instance
         */
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
        return validTransaction.toU8a();
    }

    /**
     * module hooks
     */
    export function onFinalize(): void{
        Log.info("onInitialize() called");
    }
}
