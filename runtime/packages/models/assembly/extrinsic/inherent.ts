import { CompactInt, UInt64, BytesReader } from 'as-scale-codec';
import { DecodedData } from '../decoded-data';
import { Extrinsic, ExtrinsicType } from './extrinsic';
import { Utils } from '@as-substrate/core-utils';

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
        const bytesReader = new BytesReader(input);
        const version: u8 = bytesReader.readByte();
        const callIndex: u8[] = bytesReader.readBytes(2);
        const compactPrefix: u8 = bytesReader.readByte();
        const arg: UInt64 = bytesReader.readUInt64();

        const inherent = new Inherent(callIndex, version, compactPrefix, arg);
        return new DecodedData(inherent, bytesReader.getLeftoverBytes());
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
