import { Timestamp } from "@as-substrate/timestamp-module";
import { Storage } from "@as-substrate/core-modules";
import { InherentData, Option } from "@as-substrate/models";
import { ByteArray } from 'as-scale-codec';

/**
 * Class for Aura consensus 
 */
export class AuraModule {
    /**
     * Scale encoded key {scale("aura")}{scale("authorities"}
     * Key for the AuraInherentData
     */
    public static readonly ACCOUNT_ID_KEY: u8[] = [16, 97, 117, 114, 97, 44, 97, 117, 116, 104, 111, 114, 105, 116, 105, 101, 115];
    public static readonly INHERENT_IDENTIFIER: string = "auraslot";
    /**
     * The function must call the TimeStamp module and access the MINIMUM_PERIOD and return it.
     */
    static getSlotDuration(): u64 {
        return Timestamp.MINIMUM_PERIOD;
    }

    /**
     * The function must read from the Storage the authorities that 
     * were set on genesis, create a vector of AccountIds and return it
     */
    static getAuthorities(): Option<ByteArray> {
        const value = Storage.get(AuraModule.ACCOUNT_ID_KEY);
        return value;
    }
    /**
     * The function must set the list of AccountIds to the storage
     */ 
    static setAuthorities(auths: u8[]): void {
        Storage.set(AuraModule.ACCOUNT_ID_KEY, auths);
    }
    /**
     * Verify the validity of the inherent using the timestamp.
     * @param t new value for the timestamp inherent data
     * @param data inherent data to extract aura inherent data from
     */
    static checkInherent(t: u64, data: InherentData): bool {
        const auraSlot = auraInherentData(data);
        const timestampBasedSlot = t / AuraModule.getSlotDuration();
        if (timestampBasedSlot == auraSlot) {
            return true;
        }
        else{
            return false;
        }
    }
}

/**
 * 
 * @param inhData 
 */
export function auraInherentData(inhData: InherentData): u64 {
    return inhData.data[AuraModule.INHERENT_IDENTIFIER];
}