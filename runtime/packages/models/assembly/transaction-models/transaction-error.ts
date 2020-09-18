/**
 * Class contains well-known transaction errors
 */
export class TransactionError{
    /**
     * The call of the transaction is not expected
     */
    public static readonly CALL_ERROR: u8[] = [1, 0, 0];
    /**
     * Any error to do with the transaction validity
     */
    public static readonly INVALID_PAYMENT: u8[] = [1, 0, 0];
    /**
     * Inability to pay fees (e.g. account balance too low)
     */
    public static readonly INSUFFICIENT_BALANCE: u8[] = [1, 0, 1];
    /**
     * Transaction not yet being valid (e.g. nonce too high)
     */
    public static readonly NONCE_TOO_HIGH: u8[] = [1, 0, 2];
    /**
     * Transaction being outdated (e.g. nonce too low)
     */
    public static readonly NONCE_TOO_LOW: u8[] = [1, 0, 3];
    /**
     * Invalid transaction proofs (e.g. bad signature)
     */
    public static readonly INVALID_SIGNATURE: u8[] = [1, 0, 4];

    /**
     * Could not lookup some info that is required for the transaction
     */
    public static readonly MISSING_INFO: u8[] = [1, 1, 0];

    /**
     * No validator found for the given unsigned transaction.
     */
    public static readonly NO_UNSIGNED_VALIDATOR: u8[] = [1, 1, 1];
}