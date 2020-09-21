/**
 * Class contains all well-known errors that may result from apply_extrinsic method
 */
export class ResponseCodes{
    /**
     * Prefix code for error result
     */
    static readonly ERROR_PREFIX: u8[] = [0, 1];
    /**
     * Applying extrinsic succeded
     */
    public static readonly SUCCESS: u8[] = [0, 0];
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


    /**
     * Returns a dispatch error message
     * @param moduleIndex 
     * @param errorValue specific error value
     */
    static dispatchError(moduleIndex: u8, errorValue: u8): u8[]{
        return this.ERROR_PREFIX.concat([moduleIndex, errorValue]);
    }
}