import { UInt128 } from "as-scale-codec";
import { DecodedData } from "../../codec/decoded-data";

/**
 * Class representing balance information for a given account 
 */
export class AccountData {

    /**
     * Non-reserved part of the balance. It is the total pool what may in principle be transferred and reserved.
     */
    public free: UInt128;

    /**
     * Balance which is reserved and may not be used at all.
     */
    public reserved: UInt128;

    // /**
    //  * The amount that `free` may not drop below when withdrawing for *anything except transaction fee payment.
    //  */
    // public miscFrozen: UInt128;

    // /**
    //  * The amount that `free` may not drop below when withdrawing specifically for transaction fee payment.
    //  */
    // public freeFrozen: UInt128;

    // constructor(free: UInt128, reserved: UInt128, miscFrozen: UInt128, feeFrozen: UInt128) {
    //     this.free = free;
    //     this.reserved = reserved;
    //     this.miscFrozen = miscFrozen;
    //     this.freeFrozen = feeFrozen;
    // }

    constructor(free: UInt128, reserved: UInt128) {
        this.free = free;
        this.reserved = reserved;
    }

    /**
    * SCALE Encodes the AccountData into u8[]
    */
    toU8Array(): u8[] {
        return this.free.toU8a()
            .concat(this.reserved.toU8a())
            // .concat(this.miscFrozen.toU8a())
            // .concat(this.freeFrozen.toU8a())
    }

    /**
     * Instanciates new Default AccountData object
     */
    static getDefault(): AccountData {
        return new AccountData(UInt128.Zero(), UInt128.Zero());
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

        // const miscFrozen = UInt128.fromU8a(input);
        // input = input.slice(miscFrozen.encodedLength());

        // const freeFrozen = UInt128.fromU8a(input);
        // input = input.slice(freeFrozen.encodedLength());

        const result = new AccountData(free, reserved);
        return new DecodedData<AccountData>(result, input);
    }
}