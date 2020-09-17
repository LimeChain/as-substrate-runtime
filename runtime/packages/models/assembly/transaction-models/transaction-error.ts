export class TransactionError{
    /**
     * Any error to do with the transaction validity
     */
    public static readonly VALIDITY_ERROR: u8[] = [1, 2];
    /**
     * The call of the transaction is not expected
     */
    public static readonly CALL_ERROR: u8[] = [1, 0, 0];
    /**
     * Inability to pay fees (e.g. account balance too low)
     */
    public static readonly PAYMENT_ERROR: u8[] = [1, 0, 1];
    /**
     * Transaction not yet being valid (e.g. nonce too high)
     */
    public static readonly FUTURE_ERROR: u8[] = [1, 0, 2];
    /**
     * Transaction being outdated (e.g. nonce too low)
     */
    public static readonly STALE_ERROR: u8[] = [1, 0, 3];
    /**
     * Invalid transaction proofs (e.g. bad signature)
     */
    public static readonly BAD_PROOF_ERROR: u8[] = [1, 0, 4];
}