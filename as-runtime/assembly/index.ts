import { UInt32 } from "as-scale-codec";

// Export the __heap_base - required by the Substrate Executor
export { __heap_base }

export function add(data: i32, len: i32): u64 {
  
  // const a = changetype<ArrayBuffer>(464 as i32);
  const input = Uint8Array.wrap(new ArrayBuffer(len));
  // const a = changetype<ArrayBuffer>(data as usize);

  // const ref1 = load<u8>(data);
  // const ref2 = load<u8>(data, 1);

  const uint32 = new UInt32(data);
  return encode_ptr_and_size(uint32.toU8a());
}

// TODO
function decode_ptr_and_size(ptr: i32, len: i32): u8[] {
  return [];
}

/**
 * Retains the value pointer, so that it is not GCed.
 * Encodes the value pointer and value length as one u64 number
 * @param value_ptr 
 * @param value_len 
 */
function encode_ptr_and_size(result: u8[]): u64 {
  let value_ptr = result.dataStart;
  let value_size = result.length;

  __retain(value_ptr); // adds ref to the pointer, so it's not GCed
  return ((value_size as u64) << 32) | value_ptr;
} 
