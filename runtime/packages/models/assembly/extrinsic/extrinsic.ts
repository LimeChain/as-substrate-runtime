import { DecodedData } from "../decoded-data";
import { Inherent } from "./inherent";
import { SignedTransaction } from "./signed-transaction";
import { Bytes } from 'as-scale-codec';
import { IExtrinsic } from "..";
/**
 * Type of extrinsic
 * values represent the fixed byte length of each Extrinsic type
 */
export enum ExtrinsicType{
    /**
     * Inherents (no signature; created by validators during block production)
    */
    Inherent = 10,
    /**
     * Signed Transactions (with signature; a regular transactions with known origin)
     */
    SignedTransaction = 145,
    /**
     * Unsigned Transactions (no signature; represent "system calls" or other special kinds of calls)
     */
    UnsignedTransaction = 81,
}

export abstract class Extrinsic implements IExtrinsic{
    public typeId: u64;

    constructor(typeId: u64){
        this.typeId = typeId;
    }

    abstract toU8a(): u8[];
    /**
     * Get type id of the Extrinsic
     */
    getTypeId(): i32{
        return <i32>this.typeId;
    }
    /**
     * Get encoded length of the extrinsic
     */
    encodedLength(): i32{
        switch(this.getTypeId()){
            case(ExtrinsicType.Inherent):{
                return ExtrinsicType.Inherent;
            }
            case(ExtrinsicType.SignedTransaction):{
                return ExtrinsicType.SignedTransaction;
            }
            default:{
                throw new Error("Extrinsic: Unsupported Extrinsic type: " + this.getTypeId().toString());
            }
        }
    }
    /**
     * Checks whether the extrinsic is inherent
     * @param ext 
     */
    static isInherent(ext: IExtrinsic): bool{
        return ext.getTypeId() == ExtrinsicType.Inherent;
    }

    static fromU8Array(input: u8[]): DecodedData<IExtrinsic>{
        const cmpLen = Bytes.decodeCompactInt(input);
        input = input.slice(cmpLen.decBytes);
        const type = <i32>cmpLen.value;
        switch(type){
            case ExtrinsicType.Inherent:{
                return Inherent.fromU8Array(input);
            }
            case ExtrinsicType.SignedTransaction:{
                return SignedTransaction.fromU8Array(input);
            }
            default: {
                throw new Error("Extrinsic: Unsupported Extrinsic type: " + type.toString());
            }
        }
    }

    @inline @operator('==')
    static eq(a: Extrinsic, b: Extrinsic): bool{
        const extrinsicType: i32 = a.typeId == b.typeId ? <i32>a.typeId : 0;
        switch(extrinsicType){
            case ExtrinsicType.Inherent:{
                return Inherent.eq(<Inherent>a, <Inherent>b);
            }
            case ExtrinsicType.SignedTransaction:{
                return SignedTransaction.eq(<SignedTransaction>a, <SignedTransaction>b);
            }
            default: {
                return false;
            }
        }
    }
    @inline @operator("!=")
    static notEq(a: Extrinsic, b: Extrinsic): bool{
        return !this.eq(a, b);
    }
}