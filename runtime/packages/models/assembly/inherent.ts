import { CompactInt, UInt64 } from 'as-scale-codec';
export class Inherent{
    static readonly INHERENT_LENGTH: u8 = 12;
    static readonly COMPACT_PREFIX: u8 = 11;

    public compactLen: CompactInt; 
    public callIndex: u8[];
    public version: u8;
    public arg: CompactInt | UInt64;

    toU8a(): u8[]{
        let result: u8[] = this.compactLen.toU8a();
        result = result.concat([this.version])
            .concat(this.callIndex)
            .concat([Inherent.COMPACT_PREFIX])
            .concat(this.arg.toU8a());
        return result.slice(0, Inherent.INHERENT_LENGTH);
    }
    
}