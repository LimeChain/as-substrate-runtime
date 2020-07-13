import { Header } from './header';
import {UInt64, CompactInt, BIT_LENGTH, Bytes, Bool} from 'as-scale-codec';
import {Constants} from '../constants';

/**
 * Class representing Inherent transactions in Substrate runtime
 */

 export class Inherent {
    /**
     * Unix epoch time in number of milliseconds
     */
    public timstmp0: UInt64;

    /**
     * Babe Slot Number6.5 of the current building block
     */
    public babeSlot: UInt64;

    /**
     * Header number3:6 of the last finalized block
     */
    public finalNum: CompactInt;

    /**
     * Provides a list of potential uncle block headers3:6 for a given block
     */
    public uncles00: Header[];

    constructor(timstmp0: UInt64, babeSlot: UInt64, finalNum: CompactInt, uncles00: Header[]){
        this.timstmp0 = timstmp0;
        this.babeSlot = babeSlot;
        this.finalNum = finalNum;
        this.uncles00 = uncles00;
    }

    /**
     * SCALE Encodes the Inherent into u8[]
     */
    toU8a(): u8[] {
        // populating with empty_byte_array for now
        return this.timstmp0.toU8a()
            .concat(this.babeSlot.toU8a())
            .concat(this.finalNum.toU8a())
            .concat(Constants.EMPTY_BYTE_ARRAY);
    }
    /**
     * Creates a new instance of Inherent class from SCALE encoded array of bytes
     * @param input Takes SCALE encoded array of bytes as an argument
     */
    static fromU8Array(input: u8 []): Inherent {
        const timstmp0: UInt64 = UInt64.fromU8a(input.slice(0, BIT_LENGTH.INT_64));
        input = input.slice(timstmp0.encodedLength());

        const babeSlot: UInt64 = UInt64.fromU8a(input.slice(0, BIT_LENGTH.INT_64));
        input = input.slice(babeSlot.encodedLength());

        const final = Bytes.decodeCompactInt(input);
        const finalNum = new CompactInt(final.value);
        input = input.slice(final.decBytes);

        let headers: Header[] = [];
        
        return new Inherent(timstmp0, babeSlot, finalNum, headers);
    }

    @inline @operator('==')
    static eq(a: Inherent, b: Inherent): bool {
        let equal: bool = a.timstmp0.value == b.timstmp0.value
            && a.babeSlot.value == b.babeSlot.value
            && a.finalNum.value == b.finalNum.value;
        let arrEqual: bool = true;
        // assumes that arrays have the same length - just a mock :)
        for (let i=0; i<a.uncles00.length; i++){
            if (!(a.uncles00[i] == b.uncles00[i])){
                arrEqual = false;
            }
        }
        return equal == arrEqual == true;
        
    }
}
