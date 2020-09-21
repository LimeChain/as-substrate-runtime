import { UInt64, Bool, CompactInt } from 'as-scale-codec';
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

    constructor(
        priority: UInt64, requires: TransactionTag[], provides: TransactionTag[], longevity: UInt64, propogate: Bool){
            this.priority = priority;
            this.requires = requires;
            this.provides = provides;
            this.longevity = longevity;
            this.propogate = propogate;
    }

    toU8a(): u8[]{
        // indicates that the Result<ValidTransaction, TransactionError> is ValidTransaction
        const result: u8[] = [0];

        const reqLen = new CompactInt(this.requires.length);
        let requires: u8[] = reqLen.toU8a();
        for (let i: i32 = 0; i < this.requires.length; i++){
            requires = requires.concat(this.requires[i].toU8a());
        }

        const proLen = new CompactInt(this.provides.length);
        let provides: u8[] = proLen.toU8a();
        for (let i: i32 = 0; i < this.provides.length; i++){
            provides = provides.concat(this.provides[i].toU8a());
        }
        return result.concat(this.priority.toU8a())
            .concat(requires)
            .concat(provides)
            .concat(this.longevity.toU8a())
            .concat(this.propogate.toU8a());
    }
}