import { UInt128 } from "as-scale-codec";
import { DecodedData } from "@as-substrate/models";

/**
 * Class representing balance information for a given account 
 */
export class AccountData {

    /**
     * Non-reserved part of the balance. It is the total pool what may in principle be transferred and reserved.
     */
    private free: UInt128;

    /**
     * Balance which is reserved and may not be used at all.
     */
    private reserved: UInt128;

    constructor(free: UInt128, reserved: UInt128) {
        this.free = free;
        this.reserved = reserved;
    }

    /**
    * SCALE Encodes the AccountData into u8[]
    */
    toU8a(): u8[] {
        return this.free.toU8a()
            .concat(this.reserved.toU8a());
    }

    /**
     * Sets new free value
     * @param newFree 
     */
    setFree(newFree: UInt128): void {
        this.free = newFree;
    }

    /**
     * Sets new reserved value
     * @param newReserved
     */
    setReserved(newReserved: UInt128): void {
        this.reserved = newReserved;
    }

    /**
     * Returns the free value
     */
    getFree(): UInt128 {
        return this.free;
    }

    /**
     * Returns the reserved value
     */
    getReserved(): UInt128 {
        return this.reserved;
    }

    /**
     * Instanciates new Default AccountData object
     */
    static getDefault(): AccountData {
        return new AccountData(UInt128.Zero, UInt128.Zero);
    }

    /**
     * Instanciates new AccountData object from SCALE encoded byte array
     * @param input - SCALE encoded AccountData
     * TODO - avoid slicing the aray for better performance
     */
    static fromU8Array(input: u8[]): DecodedData<AccountData> {
        const free = UInt128.fromU8a(input);
        input = input.slice(free.encodedLength());

        const reserved = UInt128.fromU8a(input);
        input = input.slice(reserved.encodedLength());

        const result = new AccountData(free, reserved);
        return new DecodedData<AccountData>(result, input);
    }

    @inline @operator('==')
    static eq(a: AccountData, b: AccountData): bool {
        return a.free == b.free && a.reserved == b.reserved;
    }

    @inline @operator('!=')
    static notEq(a: AccountData, b: AccountData): bool {
        return !AccountData.eq(a, b);
    }
}