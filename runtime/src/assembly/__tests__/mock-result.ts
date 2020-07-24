/**
 * Class used to pass mock data from the MockBuilder
 */
export class MockResult<T> {

    public instance: T;
    public bytes: u8[];

    constructor(expectedObject: T, bytes: u8[]) {
        this.instance = expectedObject;
        this.bytes = bytes;
    }

}