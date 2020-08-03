import { Storage } from '@as-substrate/core-modules';
import { InherentData } from '@as-substrate/models';
import { UInt64, Bool, ByteArray } from 'as-scale-codec';


export class Timestamp{

    /**
     * Necessary constants for timestamp
     */
    public static readonly MINIMUM_PERIOD: u64 = 5;
    public static readonly SCALE_TIMESTAMP_NOW: u8[] = [36, 116, 105, 109, 101, 115, 116, 97, 109, 112, 12, 110, 111, 119];
    public static readonly SCALE_TIMESTAMP_DID_UPDATE: u8[] = [36, 116, 105, 109, 101, 115, 116, 97, 109, 112, 36, 100, 105, 100, 117, 112, 100, 97, 116, 101];
    public static readonly INHERENT_IDENTIFIER: string = "timstmp0";
    /**
     * Sets the current time. When setting the new time, 
     * it must be greater than the last one (set into storage) with at least a MinimumPeriod
     * @param now timestamp number
     */
    static set(now: u64): void {
        const didUpdate = Storage.get(Timestamp.SCALE_TIMESTAMP_DID_UPDATE);
        if(didUpdate.isSome()){
            throw new Error('Timestamp must be updated only once in the block');
        }
        const prev: u64 = this.get();
        
        if(now < prev + Timestamp.MINIMUM_PERIOD){
            throw new Error('Timestamp must increment by at least <MinimumPeriod> between sequential blocks');
        }

        const nowu8 = new UInt64(now);
        const trueu8 = new Bool(true);
        Storage.set(Timestamp.SCALE_TIMESTAMP_DID_UPDATE, trueu8.toU8a());
        Storage.set(Timestamp.SCALE_TIMESTAMP_NOW, nowu8.toU8a());
    }

    /**
     *  Gets the current time that was set. If this function is called prior 
     *  to setting the timestamp, it will return the timestamp of the previous block.
     */
    static get(): u64 {
        const now = Storage.get(Timestamp.SCALE_TIMESTAMP_NOW);
        const res = now.isSome() ? (<ByteArray>now.unwrap()).values : [4, 0];
        const val: UInt64 = UInt64.fromU8a(res);
        return val.value;
    }

    /**
     * Creates timestamp inherent data
     * @param data inherent data to extract timestamp from
     */
    static createInherent(data: InherentData): void {
        const timestampData: u64 = extractInherentData(data);
        const nextTime = Math.max(timestampData, Timestamp.get() + Timestamp.MINIMUM_PERIOD);
        Timestamp.set(nextTime);
    }

    /**
     * Checks if the new value can be set as inherent data
     * @param t new value of the timestamp inherent data
     * @param data inherent data to extract timestamp from
     */
    static checkInherent(t: u64, data: InherentData): bool {
        const MAX_TIMESTAMP_DRIFT_MILLS: u64 = 30 * 1000;
        const timestampData: u64 = extractInherentData(data);
        const minimum: u64 = Timestamp.get() + Timestamp.MINIMUM_PERIOD;
        if (t > timestampData + MAX_TIMESTAMP_DRIFT_MILLS){
            return false;
        }
        else if(t < minimum){
            return false;
        }
        else{
            return true;
        }
    }
}

/**
 * Gets timestamp inherent data
 * @param inhData inherentData instance provided 
 */
export function extractInherentData(inhData: InherentData): u64 {
    return inhData.data[Timestamp.INHERENT_IDENTIFIER];
}