import { UInt64, CompactInt, Bytes } from 'as-scale-codec';
import { AccountId } from '@as-substrate/balances-module';
import { DecodedData } from '../decoded-data';
export class TransactionTag{
    /**
     * fixed byte length of the transaction tag
     */
    public static readonly TAG_LEN: u8 = 36;
    /**
     * Scale encoded bytes of the sender's AccountID
     */
    public sender: AccountId;
    /**
     * Nonce of the transaction
     */
    public nonce: UInt64;

    constructor(sender: AccountId, nonce: UInt64){
        this.sender = sender;
        this.nonce = nonce;
    }

    toU8a(): u8[]{
        const lenCompact = new CompactInt(TransactionTag.TAG_LEN);
        const res: u8[] = lenCompact.toU8a();
        return res.concat(this.sender.getAddress())
            .concat(this.nonce.toU8a());
    }

    static fromU8Array(input: u8[]): DecodedData<TransactionTag>{
        const tagLen = input.slice(0, 1);
        input = input.slice(1);
        const sender = AccountId.fromU8Array(input);
        input = input.slice(sender.encodedLength());
        const nonce = UInt64.fromU8a(input);
        input = input.slice(nonce.encodedLength());
        const transactionTag = new TransactionTag(sender, nonce);
        return new DecodedData(transactionTag, input);
    }
}