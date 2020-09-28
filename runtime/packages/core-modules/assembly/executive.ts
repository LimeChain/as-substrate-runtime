import { 
    Block, Header, 
    InherentData, 
    Extrinsic, Inherent, 
    ValidTransaction, TransactionTag, ResponseCodes
} from '@as-substrate/models';
import { Timestamp } from '@as-substrate/timestamp-module';
import { AuraModule } from '@as-substrate/aura-module';
import { Utils } from '@as-substrate/core-utils';
import { AccountId, BalancesModule } from '@as-substrate/balances-module';
import { CompactInt, ByteArray, Bool, UInt64, Bytes, Hash } from 'as-scale-codec';
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
        // check that parentHash is valid
        const previousBlock: CompactInt = new CompactInt(n.value - 1);
        const parentHash: Hash = System.getHashAtBlock(previousBlock);

        if(n.value == 0 && parentHash != header.parentHash){
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
        System.noteFinishedExtrinsics();
        System.computeExtrinsicsRoot();
        return System.finalize();
    }
    /**
     * creates inherents from internal modules
     * @param data inherents
     */
    export function createExtrinsics(data: InherentData): u8[] {
        const timestamp: Inherent = Timestamp.createInherent(data);
        const aura = AuraModule.createInherent(data);
        return System.ALL_MODULES.concat(timestamp.toU8a()).concat(aura);
    }

    /**
     * Apply Extrinsics
     * @param ext extrinsic
     */
    export function applyExtrinsic(ext: u8[]): u8[] {
        const encodedLen = Bytes.decodeCompactInt(ext);
        const result = Executive.applyExtrinsicWithLen(ext, encodedLen.value as u32);
        // if applying extrinsic succeeded, notify System about it
        if(Utils.areArraysEqual(result, ResponseCodes.SUCCESS)){
            System.noteAppliedExtrinsic(ext);
        }
        return result;
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
            return ResponseCodes.SUCCESS;
        }
        const cmpLen = Bytes.decodeCompactInt(ext);
        ext = ext.slice(cmpLen.decBytes);
        const result = ext.shift();
        if (result as bool){
            const extrinsic = Extrinsic.fromU8Array(ext).result;
            return BalancesModule.applyExtrinsic(extrinsic);
        }
        return ResponseCodes.CALL_ERROR;
    }

    /**
     * Initial transaction validation
     * @param source source of the transaction (external, inblock, etc.)
     * @param utx transaction
     */
    export function validateTransaction(source: u8[], utx: Extrinsic): u8[] {
        const from: AccountId = AccountId.fromU8Array(utx.from.toU8a()).result;
        const transfer = utx.getTransferBytes();

        if(!Crypto.verifySignature(utx.signature, transfer, from)){
            Log.error("Validation error: Invalid signature");
            return ResponseCodes.INVALID_SIGNATURE;
        }   
        const nonce = System.accountNonce(from);
        if (<u64>nonce.value >= <u64>utx.nonce.value){
            Log.error("Validation error: Nonce value is less than or equal to the latest nonce");
            return ResponseCodes.NONCE_TOO_LOW;
        }
        const validated = BalancesModule.validateTransaction(utx);
        if(!validated.valid){
            Log.error(validated.message);
            return validated.error;
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
