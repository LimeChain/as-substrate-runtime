import { Timestamp } from '@as-substrate/timestamp-module';
import { Serialiser } from '@as-substrate/core-utils';
import { UInt64 } from 'as-scale-codec';

export function test_timestamp_get(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const now = Timestamp.get();
    const res = new UInt64(now)
    return Serialiser.serialiseResult(res.toU8a());
}

export function test_timestamp_set(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const now = UInt64.fromU8a(input);
    Timestamp.set(now.value);
    return Serialiser.serialiseResult([]);
}
