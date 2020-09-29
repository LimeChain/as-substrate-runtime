import { CompactInt, UInt64, BIT_LENGTH, Bytes } from 'as-scale-codec';
import { DecodedData } from '../decoded-data';
import { Extrinsic, ExtrinsicType } from './extrinsic';

export class Inherent extends Extrinsic{
    /**
     * Length of the ByteArray
     */
    public compactLen: CompactInt; 
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

    constructor(compactLen: CompactInt, callIndex: u8[], version: u8, prefix: u8, arg: UInt64){
        super(ExtrinsicType.Inherent);
        this.compactLen = compactLen;
        this.callIndex = callIndex;
        this.version = version;
        this.prefix = prefix;
        this.arg = arg;
    }

    toU8a(): u8[]{
        let type: u8[] = [<u8>ExtrinsicType.Inherent];
        let lenU8a = this.compactLen.toU8a();
        let result = type.concat(lenU8a);
        result = result.concat([this.version])
            .concat(this.callIndex)
            .concat([this.prefix])
            .concat(this.arg.toU8a());
        return result.slice(0, <i32>this.compactLen.value + lenU8a.length);
    }

    /**
     * Convert SCALE encoded bytes to an instance of Inherent
     */
    static fromU8Array(input: u8[]): DecodedData<Extrinsic>{
        const compactLen = CompactInt.fromU8a(input);
        input = input.slice(compactLen.encodedLength());
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

        const inherent = new Inherent(compactLen, callIndex, version, compactPrx, arg);
        return new DecodedData(inherent, input);
    }
}
