export class TransactionValidity{
    public valid: bool;
    public error: u8[];
    public message: String;

    constructor(valid: bool, error: u8[], message: String){
        this.valid = valid;
        this.error = error;
        this.message = message;
    }
}