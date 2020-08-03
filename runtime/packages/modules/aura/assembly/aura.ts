import { Timestamp } from "@as-substrate/timestamp-module";
import { AccountId } from "@as-substrate/balances-module";
import { Storage } from "@as-substrate/core-modules";

/**
 * Class for Aura consensus 
 */
export class AuraModule {
    /**
     * Scale encoded key {scale("aura")}{scale("authorities"}
     */
    public static readonly ACCOUNT_ID_KEY: u8[] = [16, 97, 117, 114, 97, 44, 97, 117, 116, 104, 111, 114, 105, 116, 105, 101, 115];

    static getSlotDuration(): u64 {
        return Timestamp.MINIMUM_PERIOD;
    }

    static getAuthorities(): AccountId[] {
        const value = Storage.get(AuraModule.ACCOUNT_ID_KEY);
    }
}