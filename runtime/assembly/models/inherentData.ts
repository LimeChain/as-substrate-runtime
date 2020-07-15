import { CompactInt, Bytes, ScaleString, ByteArray } from 'as-scale-codec';
import { Constants } from '../constants';
import { DecodedData } from '../codec/decoded-data';

/**
 * Class representing InherentData transactions in Substrate runtime
 */

 export class InherentData {
    /**
     * A hashtable (Map, in our case) representing the totality of 
     * inherent extrinsics included in each block. 
     */
    public data: Map<ScaleString, ByteArray>;

    constructor(data: Map<ScaleString, ByteArray>){
        this.data = data;
    } 

    /**
     * SCALE Encodes the InherentData into u8[]
     */
    toU8a(): u8[] {
        let result: u8[] = [];
        let keys = this.data.keys();
        const len: CompactInt = new CompactInt(keys.length);
        result = result.concat(len.toU8a());
        for (let i = 0; i<keys.length; i++){
            result = result.concat(keys[i].toU8a().slice(1, Constants.INHERENT_IDENTIFIER_LENGTH + 1));
            assert(this.data.has(keys[i]), "InherentData: Key doesn't exist in data");
            const value: u8[] = this.data.get(keys[i]).toU8a();
            result = result.concat(value);
        }
        return result;
    }
    /**
     * Creates a new instance of InherentData class from SCALE encoded array of bytes
     * @param input Takes SCALE encoded array of bytes as an argument
     */
    static fromU8Array(input: u8 []): DecodedData<InherentData> {
        const data: Map<ScaleString, ByteArray> = new Map<ScaleString, ByteArray>();
        const lenComp = Bytes.decodeCompactInt(input);
        input = input.slice(lenComp.decBytes);

        for (let i: u64 = 0; i<lenComp.value; i++){
            const buff = new Uint8Array(Constants.INHERENT_IDENTIFIER_LENGTH);
            Bytes.copyToTyped(input.slice(0, Constants.INHERENT_IDENTIFIER_LENGTH), buff);
            let key =  new ScaleString(String.UTF8.decode(buff.buffer));
            input = input.slice(Constants.INHERENT_IDENTIFIER_LENGTH);
            let value = ByteArray.fromU8a(input);
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
