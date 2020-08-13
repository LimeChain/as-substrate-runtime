import { Serialiser } from "@as-substrate/core-utils";
import { AuraModule } from "@as-substrate/aura-module";
import { Logging } from "@as-substrate/logging-module";
import { UInt64, ByteArray } from 'as-scale-codec';
/**
 * Test getSlotDuration() method of AuraModule
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function AuraApi_slot_duration(data: i32, len: i32): u64 {
    Logging.printUtf8("aura slot called");
    const input = Serialiser.deserialiseInput(data, len);
    const slotDuration = AuraModule.getSlotDuration();
    const res = new UInt64(slotDuration);
    return Serialiser.serialiseResult(res.toU8a());
}

/**
 * Test getAuthorities() method of AuraModule
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function AuraApi_authorities(data: i32, len: i32): u64 {
    Logging.printUtf8("aura auth called");
    const input = Serialiser.deserialiseInput(data, len);
    const authorities = AuraModule.getAuthorities();
    // return Serialiser.serialiseResult(authorities);
    return authorities.isSome() ? Serialiser.serialiseResult((<ByteArray>authorities.unwrap()).values) : Serialiser.serialiseResult([]);
}

/**
 * Test setAuthorities() method of AuraModule
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function AuraApi_set_authorities(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    AuraModule.setAuthorities(input);
    return Serialiser.serialiseResult(input);
}
