import { AccountId } from '@as-substrate/balances-module';
import { UInt64 } from 'as-scale-codec';
import { DecodedData } from './decoded-data';
export class Transfer{
    /**
     * from address
     */
    public from: AccountId;
    /**
     * to address
     */
    public to: AccountId;
    /**
     * amount of transfer
     */
    public amount: UInt64;
    /**
     * nonce of the transfer
     */
    public nonce: UInt64;

    constructor(from: AccountId, to: AccountId, amount: UInt64, nonce: UInt64){
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.nonce = nonce;
    }

    toU8a(): u8[]{
        return this.from.getAddress()
            .concat(this.to.getAddress())
            .concat(this.amount.toU8a())
            .concat(this.nonce.toU8a())
    }

    static fromU8Array(input: u8[]): DecodedData<Transfer>{
        const from = AccountId.fromU8Array(input);
        input = input.slice(from.encodedLength());

        const to = AccountId.fromU8Array(input);
        input = input.slice(to.encodedLength());

        const amount = UInt64.fromU8a(input);
        input = input.slice(amount.encodedLength());
        
        const nonce = UInt64.fromU8a(input);
        input = input.slice(nonce.encodedLength());
        
        const transfer = new Transfer(from, to, amount, nonce);

        return new DecodedData(transfer, input);
    }
}