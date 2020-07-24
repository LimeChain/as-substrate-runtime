import { DecodedData } from "@as-substrate/models"
import { Utils } from "@as-substrate/core-utils";

/**
 * Thin wrapper of SCALE Hash that represents Account ID (SS58)
 */
export class AccountId {

    /**
     * Length of Address in Bytes
     */
    public static readonly ADDRESS_LENGTH:i32 = 32;

    /**
     * Bytes 32 representing the public address of the Account
     */
    private address: u8[];

    constructor(bytes: u8[]) {
        assert(bytes.length == AccountId.ADDRESS_LENGTH, "AccountId: invalid bytes length provided.");
        this.address = new Array<u8>();
        this.address = this.address.concat(bytes);
    }

    /**
     * Returns the Bytes that represent the address 
     */
    getAddress(): u8[] {
        return this.address;
    }

    /**
     * Returns the number of bytes used for encoding AccountId
     */
    encodedLength(): i32 {
        return this.address.length;
    }

    /**
     * Instanciates new Account ID from Bytes Array
     * @param input 
     */
    static fromU8Array(input: u8[]): DecodedData<AccountId> {
        assert(input.length >= AccountId.ADDRESS_LENGTH, "AccountId: Invalid bytes length provided. EOF");
        const accId = new AccountId(input.slice(0, AccountId.ADDRESS_LENGTH));
        return new DecodedData<AccountId>(accId, input.slice(AccountId.ADDRESS_LENGTH));
    }

    @inline @operator('==')
    static eq(a: AccountId, b: AccountId): bool {
        return Utils.areArraysEqual(a.getAddress(), b.getAddress());
    }

    @inline @operator('!=')
    static notEq(a: AccountId, b: AccountId): bool {
        return !Utils.areArraysEqual(a.getAddress(), b.getAddress());
    }

}