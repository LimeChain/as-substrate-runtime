import { CompactInt, UInt32, Bytes, ByteArray } from 'as-scale-codec';
import { DecodedData } from './decoded-data';
export class ExtrinsicData{
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
            result = result
            .concat(this.data.get(keys[i]).toU8a());
        }
        return result;
    }

    insert(key: UInt32, value: ByteArray): void {
        this.data.set(key, value);
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
            const key = UInt32.fromU8a(input);
            input = input.slice(key.encodedLength());
            const value = ByteArray.fromU8a(input);
            input = input.slice(value.encodedLength());
            data.set(key, value);
        }
        const extcsData = new ExtrinsicData(data);
        return new DecodedData<ExtrinsicData>(extcsData, input);
    }

}