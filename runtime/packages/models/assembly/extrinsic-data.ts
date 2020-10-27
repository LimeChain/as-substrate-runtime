import { CompactInt, UInt32, Bytes, ByteArray, BIT_LENGTH } from 'as-scale-codec';
import { DecodedData } from './decoded-data';
import { IExtrinsicData } from './interfaces';
export class ExtrinsicData implements IExtrinsicData{
    /**
     * Extrinsic data for the current block 
     * (maps an extrinsic's index to its data/bytes)
     */
    public data: Map<UInt32, ByteArray>;
    
    constructor(data: Map<UInt32, ByteArray>){
        this.data = data;
    }

    toU8a(): u8[]{
        let result: u8[] = [];
        let keys: UInt32[] = this.data.keys();
        let lenData: CompactInt = new CompactInt(<u8>(keys.length));
        result = result.concat(lenData.toU8a());
        for(let i = 0; i < keys.length; i++){
            result = result
            .concat(keys[i].toU8a())
            .concat(this.data.get(keys[i]).toU8a());
        }
        return result;
    }

    /**
     * Enumerated items, from which orderedTrieRoot will get 
     * The items consist of a SCALE encoded array containing only values, corresponding 
     * key of each value is the index of the item in the array, starting at 0.
     * In our case same as toU8a() but with only values concatenated
     */
    toEnumeratedValues(): u8[]{
        let result: u8[] = [];
        let keys: UInt32[] = this.data.keys();
        let lenData: CompactInt = new CompactInt(<u8>(keys.length));
        result = result.concat(lenData.toU8a());
        for(let i=0; i < keys.length; i++){
            let extLength = new CompactInt(this.data.get(keys[i]).toU8a().length);
            result = result
            .concat(extLength.toU8a())
            .concat(this.data.get(keys[i]).toU8a());
        }
        return result;
    }

    getData(): Map<UInt32, ByteArray>{
        return this.data; 
    }

    insert(key: UInt32, value: ByteArray): void {
        this.data.set(key, value);
    }

    encodedLength(): i32{
        return this.toU8a().length;
    }
    /**
     * Initializes ExtrinsicData from bytes
     * @param input 
     */
    static fromU8Array(input: u8[]): DecodedData<ExtrinsicData>{
        const data: Map<UInt32, ByteArray> = new Map();
        const lenKeys = Bytes.decodeCompactInt(input);
        input = input.slice(lenKeys.decBytes);
        for (let i: u64 = 0; i < lenKeys.value; i++){
            const key = UInt32.fromU8a(input.slice(0, BIT_LENGTH.INT_32));
            input = input.slice(key.encodedLength());
            const value = ByteArray.fromU8a(input);
            input = input.slice(value.encodedLength());
            data.set(key, value);
        }
        const extcsData = new ExtrinsicData(data);
        return new DecodedData<ExtrinsicData>(extcsData, input);
    }
/**
     * Overloaded equals operator
     * @param a instance of ExtrinsicData
     * @param b Instance of ExtrinsicData
     */
    @inline @operator('==')
    static eq(a: ExtrinsicData, b: ExtrinsicData): bool {
        let areEqual = true;
        const aKeys = a.data.keys();
        const bKeys = b.data.keys();

        if(aKeys.length != bKeys.length){
            return false;
        }
        for (let i=0; i<aKeys.length; i++){
            if(aKeys[i] != bKeys[i]){
                areEqual = false;
                break;
            }
        }
        return areEqual;
    }
}