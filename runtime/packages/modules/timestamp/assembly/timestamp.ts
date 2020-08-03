import { Storage } from '@as-substrate/core-modules';
import { UInt64, Bool, ByteArray, ScaleString } from 'as-scale-codec';

// const timestamp = new ScaleString('timestamp');
// const now = new ScaleString('now');
// const didupdate = new ScaleString('didupdate');

export class Timestamp{
    
    /**
     * Necessary constants for timestamp
     */
    public static readonly MINIMUM_PERIOD: u64 = 5;
    public static readonly SCALE_TIMESTAMP_NOW: u8[] = [36, 116, 105, 109, 101, 115, 116, 97, 109, 112, 12, 110, 111, 119];
    public static readonly SCALE_TIMESTAMP_DID_UPDATE: u8[] = [36, 116, 105, 109, 101, 115, 116, 97, 109, 112, 36, 100, 105, 100, 117, 112, 100, 97, 116, 101];

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
}