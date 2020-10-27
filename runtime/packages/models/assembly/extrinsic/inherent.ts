import { CompactInt, UInt64, BIT_LENGTH, Bytes } from 'as-scale-codec';
import { DecodedData } from '../decoded-data';
import { Extrinsic, ExtrinsicType } from './extrinsic';
import { Utils } from '@as-substrate/core-utils';
import { IExtrinsic } from '..';

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
    static fromU8Array(input: u8[]): DecodedData<IExtrinsic>{
        // get only inherent bytes
        let inherentU8a = input.slice(0, ExtrinsicType.Inherent);
        input = input.slice(ExtrinsicType.Inherent);

        const version = inherentU8a[0];
        inherentU8a = inherentU8a.slice(1);
        const callIndex = inherentU8a.slice(0, 2);
        inherentU8a = inherentU8a.slice(2);
        const compactPrx = inherentU8a[0];
        inherentU8a = inherentU8a.slice(1);
        
        const initLen = inherentU8a.length;
        inherentU8a.length = BIT_LENGTH.INT_64;
        const arg = UInt64.fromU8a(inherentU8a.fill(0, initLen, inherentU8a.length));
        inherentU8a = inherentU8a.slice(arg.encodedLength());

        const inherent = new Inherent(callIndex, version, compactPrx, arg);
        return new DecodedData(inherent, input);
    }

    @inline @operator('==')
    static eq(a: Inherent, b: Inherent): bool{
        return Utils.areArraysEqual(a.callIndex, b.callIndex) &&
            a.prefix == b.prefix &&
            a.version == b.version &&
            a.arg == b.arg;
    }

    @inline @operator('!=')
    static notEq(a: Inherent, b: Inherent): bool{
        return !Inherent.eq(a, b);
    }
}