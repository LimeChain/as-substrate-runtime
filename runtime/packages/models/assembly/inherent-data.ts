import { CompactInt, Bytes, ByteArray } from 'as-scale-codec';
import { DecodedData } from './decoded-data';
import { Utils } from '@as-substrate/core-utils';
/**
 * Class representing InherentData transactions in Substrate runtime
 */

export class InherentData {
    
    /**
    * Length of the InherentIdentifier in InherentData
    */
    public static readonly INHERENT_IDENTIFIER_LENGTH:i32 = 8;

    /**
     * A hashtable (Map, in our case) representing the totality of 
     * inherent extrinsics included in each block. 
     */
    public data: Map<string, ByteArray>;

    constructor(data: Map<string, ByteArray>){
        let keys: string[] = data.keys();
        for (let i = 0; i < keys.length; i++){
            assert(keys[i].length == 8, "InherentData: Key length should be equal to 8!");
        }
        this.data = data;
    } 

    /**
     * SCALE Encodes the InherentData into u8[]
     */
    toU8a(): u8[] {
        let result: u8[] = [];
        let keys: string[] = this.data.keys();
        const len: CompactInt = new CompactInt(keys.length);
        result = result.concat(len.toU8a());
        for (let i = 0; i<keys.length; i++){
            const u8Key = Uint8Array.wrap(String.UTF8.encode(keys[i]));
            result = result.concat(Utils.toU8Array(u8Key));
            
            const value: u8[] = this.data.get(keys[i]).toU8a();
            result = result.concat(value);
        }
        return result;
    }
    
    /**
     * Creates a new instance of InherentData class from SCALE encoded array of bytes
     * @param input Takes SCALE encoded array of bytes as an argument
     */
    static fromU8Array(input: u8[]): DecodedData<InherentData> {
        const data: Map<string, ByteArray> = new Map<string, ByteArray>();
        const lenComp = Bytes.decodeCompactInt(input);
        input = input.slice(lenComp.decBytes);

        for (let i: u64 = 0; i<lenComp.value; i++){
            const buff = new Uint8Array(InherentData.INHERENT_IDENTIFIER_LENGTH);
            Bytes.copyToTyped(input.slice(0, InherentData.INHERENT_IDENTIFIER_LENGTH), buff);
            let key: string =  String.UTF8.decode(buff.buffer);
            input = input.slice(InherentData.INHERENT_IDENTIFIER_LENGTH);
            let value: ByteArray = ByteArray.fromU8a(input);
            input = input.slice(value.encodedLength());
            data.set(key, value);
        }
        const inherentData = new InherentData(data);
        return new DecodedData<InherentData>(inherentData, input);
    }

    /**
     * Overloaded equals operator
     * @param a instance of InherentData
     * @param b Instance of InherentData
     */
    @inline @operator('==')
    static eq(a: InherentData, b: InherentData): bool {
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
