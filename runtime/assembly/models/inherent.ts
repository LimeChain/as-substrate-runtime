import { Header } from './header';
import {UInt64, CompactInt, BIT_LENGTH, Bytes} from 'as-scale-codec';
import {Constants} from '../constants';

/**
 * Class representing Inherent transactions in Substrate runtime
 */

 export class Inherent {
    /**
     * Unix epoch time in number of milliseconds
     */
    public timestamp: UInt64;

    /**
     * Babe Slot Number6.5 of the current building block
     */
    public babeslot: UInt64;

    /**
     * Header number3:6 of the last finalized block
     */
    public finalnum: CompactInt;

    /**
     * Provides a list of potential uncle block headers3:6 for a given block
     */
    public uncles: Header[];

    constructor(timestamp: UInt64, babeslot: UInt64, finalnum: CompactInt, uncles: Header[]){
        this.timestamp = timestamp;
        this.babeslot = babeslot;
        this.finalnum = finalnum;
        this.uncles = uncles;
    }

    /**
     * SCALE Encodes the Inherent into u8[]
     */
    toU8a(): u8[] {
        // populating with empty_byte_array for now
        return this.timestamp.toU8a()
            .concat(this.babeslot.toU8a())
            .concat(this.finalnum.toU8a())
            .concat(Constants.EMPTY_BYTE_ARRAY);
    }
    /**
     * Creates a new instance of Inherent class from SCALE encoded array of bytes
     * @param input Takes SCALE encoded array of bytes as an argument
     */
    static fromU8Array(input: u8 []): Inherent {
        const timestamp: UInt64 = UInt64.fromU8a(input.slice(0, BIT_LENGTH.INT_64));
        input = input.slice(timestamp.encodedLength());

        const babeslot: UInt64 = UInt64.fromU8a(input.slice(0, BIT_LENGTH.INT_64));
        input = input.slice(babeslot.encodedLength());

        const final = Bytes.decodeCompactInt(input);
        const finalnum = new CompactInt(final.value);
        input = input.slice(final.decBytes);

        let headers: Header[] = [Header.emptyHeader()];
        
        return new Inherent(timestamp, babeslot, finalnum, headers);
    }

    @inline @operator('==')
    static eq(a: Inherent, b: Inherent): bool {
        let equal: bool = a.timestamp.value == b.timestamp.value
            && a.babeslot.value == b.babeslot.value
            && a.finalnum.value == b.finalnum.value;
        let arrEqual: bool = true;
        // assumes that arrays have the same length - just a mock :)
        for (let i=0; i<a.uncles.length; i++){
            if (!(a.uncles[i] == b.uncles[i])){
                arrEqual = false;
            }
        }
        return equal == arrEqual == true;
        
    }
}

