import { CompactInt } from 'as-scale-codec';
export class TransactionTag{
    /**
     * Scale encoded bytes of the sender's AccountID
     */
    public sender: u8[];
    /**
     * Nonce of the transaction
     */
    public nonce: CompactInt;

    toU8a(){
        return this.sender.concat(this.nonce.toU8a());
    }
}