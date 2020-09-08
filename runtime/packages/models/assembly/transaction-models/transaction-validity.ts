import { ValidTransaction } from "./valid-transaction";
import { TransactionError } from "./transaction-error";

export class TransactionValidity{
    /**
     * 
     */
    // public valid: bool;

    /**
     * valid transaction with necessary methods
     */
    public validTransaction: ValidTransaction;
    /**
     * transaction errors
     */
    public transactionError: TransactionError;

    constructor(validTransaction: ValidTransaction, error: TransactionError){
        this.validTransaction = validTransaction;
        this.transactionError = error;
    }

    toU8a(): u8[]{
        return this.validTransaction.toU8a()
            .concat(this.transactionError.toU8a());
    }
}