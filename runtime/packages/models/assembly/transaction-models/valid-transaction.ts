import { UInt64, Bool, ByteArray, BIT_LENGTH } from 'as-scale-codec';
import { DecodedData } from '../decoded-data';
import { TransactionTag } from './transaction-tag';

export class ValidTransaction{
    /**
     * Priority determines the ordering of two transactions that have all
     * their dependencies satisfied
     */
    public priority: UInt64;
    /**
     * Transaction dependencies
     * A non-empty list signifies that some other transactions which 
     * provide given tags are required to be included before that one.
     */
    public requires: TransactionTag[];
    /**
     * A list of tags this transaction provides. Successfully 
     * importing the transaction will enable other transactions 
     * that depend on (require) those tags to be included as well
     */
    public provides: TransactionTag[];
    /**
     * Longevity describes minimum number of blocks the validity 
     * is correct. After this period transaction should be 
     * removed from the pool or revalidated.
     */
    public longevity: UInt64;
    /**
     * A flag indicating if the transaction should be propagated to other peers.
     */
    public propogate: Bool;

    toU8a(){

        let requires: u8[] = [];
        for (let i: i32 = 0; i < this.requires.length; i++){
            requires = requires.concat(this.requires[i].toU8a());
        }

        let provides: u8[] = [];
        for (let i: i32 = 0; i < this.provides.length; i++){
            provides = provides.concat(this.provides[i].toU8a());
        }

        return this.priority.toU8a()
            .concat(requires)
            .concat(provides)
            .concat(this.longevity.toU8a())
            .concat(this.propogate.toU8a())
    }

    // static fromU8Array(input: u8[]): DecodedData<TransactionValidity>{
    //     const priority = UInt64.fromU8a(input.slice(0, BIT_LENGTH.INT_64));
    //     input = input.slice(BIT_LENGTH.INT_64);

    //     const require

    // }
}