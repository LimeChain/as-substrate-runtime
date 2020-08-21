import { Hash, CompactInt, ScaleString, Bytes } from 'as-scale-codec';
import { Log } from './log';

export class Helpers{
    static getDefaultBlockHash(): Map<CompactInt, Hash>{
        const defaultMap: Map<CompactInt, Hash> = new Map();
        defaultMap.set(new CompactInt(0), Helpers.getPopulatedHash(69));
        return defaultMap;
    }

    /**
     * Converts storage key to u8a
     * @param modPrefix module prefix
     * @param stgPrefix storage prefix
     */
    static stringsToU8a(args: string[]): u8[]{
        let result: u8[] = [];
        for (let i=0; i<args.length ; i++){
            const strScale = new ScaleString(args[i]); 
            result = result.concat(strScale.toU8a());
        }
        return result;
    }
    /**
     * 
     * @param byte default byte
     */
    static getPopulatedHash(byte: u8): Hash {
        const hashBytes: u8[] = new Array<u8>(32);
        hashBytes.fill(byte);
        return Hash.fromU8a(hashBytes);
    }
    /**
     * Converts SCALE encoded bytes to Map<CompactInt, Hash> 
     * @param input SCALE encoded Map<CompactInt, Hash>
     */
    static blockHashFromU8Array(input: u8[]): Map<CompactInt, Hash>{
        Log.printUtf8(input.toString());
        const blockHash: Map<CompactInt, Hash> = new Map<CompactInt, Hash>();
        Log.printUtf8('helper1')
        const lenComp = Bytes.decodeCompactInt(input);
        input = input.slice(lenComp.decBytes);
        for (let i: u64 = 0; i<lenComp.value; i++){
            Log.printUtf8('inside loop');
            const blockNumber = Bytes.decodeCompactInt(input);
            input = input.slice(lenComp.decBytes);
            const parentHash = Hash.fromU8a(input);
            input = input.slice(parentHash.encodedLength());
            blockHash.set(new CompactInt(blockNumber.value), parentHash);
        }
        return blockHash;
    }

    /**
     * SCALE Encodes the Map<CompactInt, Hash> into u8[]
     */
    static blockHashToU8a(blockHash: Map<CompactInt, Hash>): u8[] {
        let result: u8[] = [];
        let keys: CompactInt[] = blockHash.keys();
        const len: CompactInt = new CompactInt(keys.length);
        result = result.concat(len.toU8a());
        
        for (let i = 0; i<keys.length; i++){
            result = result.concat(keys[i].toU8a());
            
            const value: u8[] = blockHash.get(keys[i]).toU8a();
            result = result.concat(value);
        }
        return result;
    }
}