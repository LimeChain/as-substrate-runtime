import { CompactInt, UInt64, BIT_LENGTH, Bytes } from 'as-scale-codec';
import { DecodedData } from '../decoded-data';
import { Extrinsic, ExtrinsicType } from './extrinsic';

export class Inherent extends Extrinsic{
    /**
     * Of inherent
     */
    public callIndex: u8[];
    /**
     * API version
     */
    public version: u8;
    /**
     * Compact prefix
     */
    public prefix: u8;
    /**
     * Inherent value
     */
    public arg: UInt64;

    constructor(callIndex: u8[], version: u8, prefix: u8, arg: UInt64){
        super(ExtrinsicType.Inherent);
        this.callIndex = callIndex;
        this.version = version;
        this.prefix = prefix;
        this.arg = arg;
    }

    toU8a(): u8[]{
        let len = new CompactInt(ExtrinsicType.Inherent);
        let result = len.toU8a();
        result = result.concat([this.version])
            .concat(this.callIndex)
            .concat([this.prefix])
            .concat(this.arg.toU8a());
        return result.slice(0, <i32>len.value + len.encodedLength());
    }

    /**
     * Convert SCALE encoded bytes to an instance of Inherent
     */
    static fromU8Array(input: u8[]): DecodedData<Extrinsic>{
        const version = input[0];
        input = input.slice(1);
        const callIndex = input.slice(0, 2);
        input = input.slice(2);
        const compactPrx = input[0];
        input = input.slice(1);
        
        const initLen = input.length;
        input.length = BIT_LENGTH.INT_64;
        const arg = UInt64.fromU8a(input.fill(0, initLen, input.length));
        input = input.slice(arg.encodedLength());

        const inherent = new Inherent(callIndex, version, compactPrx, arg);
        return new DecodedData(inherent, input);
    }
}
