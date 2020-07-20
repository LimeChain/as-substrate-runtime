/**
 * Thin wrapper of SCALE Hash that represents Account ID (SS58)
 */
export class AccountId {

    /**
     * TODO
     */
    public address: u8[];



    /**
     * Returns the Bytes that represent the address 
     */
    getAddress(): u8[] {
        return this.address;
    }

}