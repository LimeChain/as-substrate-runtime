export interface IDecodedData<T>{
    /**
     * @description Get Result of the decoding
     */
    getResult(): T;
    /**
     * @description Get leftover input bytes after decoding
     */
    getInput(): u8[];
}