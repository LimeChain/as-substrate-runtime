import { Utils } from '@as-substrate/core-utils';
export class TransactionError{
    /**
     * transaction is invalid
     */
    public invalidTransaction: string;
    /**
     * transaction's validity can't be determined
     */
    public unknownTransaction: string;

    toU8a(){
        return Utils.stringsToU8a([this.invalidTransaction, this.unknownTransaction]);
    }
}