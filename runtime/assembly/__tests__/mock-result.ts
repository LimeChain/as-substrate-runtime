/**
 * Class used to pass mock data from the MockBuilder
 */
export class MockResult<T> {

    public expectedObject: T;
    public bytes: u8[];

    constructor(expectedObject: T, bytes: u8[]) {
        this.expectedObject = expectedObject;
        this.bytes = bytes;
    }

}