/**
 * Export the __heap_base - required by the Substrate Executor
 * IMPORTANT! - This is not the actual __heap_base constant of AS. It is used to point Subtrate Executor to write
 * it's parameters at the start of the memory, which is reserved using --memoryBase (16MB)
 */
export const __heap_base = 0;

export function add(data: i32, len: i32): u64 {
  const arr = deserialise_result(data, len);
  
  return serialise_result(arr);
}

function deserialise_result(ptr: i32, len: i32): Uint8Array {
  var input = new ArrayBuffer(len);
  memory.copy(changetype<usize>(input), ptr, len);
  return Uint8Array.wrap(input);
}

/**
 * Retains the value pointer, so that it is not GCed.
 * Encodes the value pointer and value length as one u64 number
 * @param value_ptr 
 * @param value_len 
 */
function serialise_result(result: Uint8Array): u64 {
  let value_ptr = result.dataStart;
  let value_size = result.length;

  __retain(value_ptr); // adds ref to the pointer, so it's not GCed
  return ((value_size as u64) << 32) | value_ptr;
}