
/**
 * Class used to return the result of decoding an object, together with a sliced array of bytes that are left for decoding
 */
export class DecodedData<T> {

    /**
     * The result of the decoding of an object
     */
    public result: T;
    /**
     * The array of bytes left to be decoded
     */
    public input: u8[];

    getResult(): T {
        return this.result;
    }

    getInput(): u8[]{
        return this.input;
    }

    constructor(result: T, input: u8[]) {
        this.result = result;
        this.input = input;
    }
}