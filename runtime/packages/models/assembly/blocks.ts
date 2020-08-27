import { Hash, CompactInt, Bytes } from 'as-scale-codec';
import { Utils } from '@as-substrate/core-utils';
import { DecodedData } from '.';

export class Blocks{
    /**
     * Map from BlockNumber to Block Hashes
     */
    public data: Map<CompactInt, Hash>;
    
    constructor(data: Map<CompactInt, Hash>){
        this.data = data;
    }

    /**
     * insert pair to the Map
     * @param key 
     * @param value 
     */
    insert(key: CompactInt, value: Hash): void{
        let oldData = this.data;
        oldData.set(key, value);
        this.data = oldData;
    }
    /**
     * SCALE Encodes the Map<CompactInt, Hash> into u8[]
     */
    toU8a(): u8[] {
        let result: u8[] = [];
        let keys: CompactInt[] = this.data.keys();
        const len: CompactInt = new CompactInt(keys.length);
        result = result.concat(len.toU8a());
        
        for (let i = 0; i<keys.length; i++){
            result = result.concat(keys[i].toU8a());
            
            const value: u8[] = this.data.get(keys[i]).toU8a();
            result = result.concat(value);
        }
        return result;
    }
    /**
     * get default instance
     */
    static default(): Blocks{
        const defaultMap: Map<CompactInt, Hash> = new Map();
        defaultMap.set(new CompactInt(0), Utils.getPopulatedHash(69));
        return new Blocks(defaultMap);
    }
    /**
     * Converts SCALE encoded bytes to Map<CompactInt, Hash> 
     * @param input SCALE encoded Map<CompactInt, Hash>
     */
    static fromU8Array(input: u8[]): DecodedData<Blocks>{
        const data: Map<CompactInt, Hash> = new Map<CompactInt, Hash>();
        const lenComp = Bytes.decodeCompactInt(input);
        input = input.slice(lenComp.decBytes);
        for (let i: u64 = 0; i<lenComp.value; i++){
            const blockNumber = Bytes.decodeCompactInt(input);
            input = input.slice(lenComp.decBytes);
            const parentHash = Hash.fromU8a(input);
            input = input.slice(parentHash.encodedLength());
            data.set(new CompactInt(blockNumber.value), parentHash);
        }
        const blocks = new Blocks(data);
        return new DecodedData<Blocks>(blocks, input);
    }
}