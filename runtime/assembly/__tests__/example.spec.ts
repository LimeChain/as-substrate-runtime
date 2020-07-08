import { Header } from '../models/header';
const SCALE_HEADER: u8[] = [
  69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69,
  4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

describe("Header", () => {
  it("should instanciate header from SCALE encoded Byte array", () => {
    const decodedData = Header.fromU8Array(SCALE_HEADER);
    const header: Header = decodedData.result;
    expect(header.toU8a()).toHaveLength(SCALE_HEADER.length);
    expect(header.toU8a().toString()).toBe(SCALE_HEADER.toString());
    __retain(changetype<usize>(decodedData.result));
  });
});