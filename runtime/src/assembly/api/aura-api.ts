import { Serialiser } from "@as-substrate/core-utils";
import { AuraModule } from "@as-substrate/aura-module";
import { Logging } from "@as-substrate/core-modules";
import { UInt64, ByteArray } from 'as-scale-codec';

/**
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function AuraApi_slot_duration(data: i32, len: i32): u64 {
    const slotDuration = AuraModule.getSlotDuration();
    const res = new UInt64(slotDuration);
    return Serialiser.serialiseResult(res.toU8a());
}

/**
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function AuraApi_authorities(data: i32, len: i32): u64 {
    Logging.printUtf8("Aura authorities called")
    const authorities = AuraModule.getAuthorities();
    return authorities.isSome() ? Serialiser.serialiseResult((<ByteArray>authorities.unwrap()).values) : Serialiser.serialiseResult([]);
}
