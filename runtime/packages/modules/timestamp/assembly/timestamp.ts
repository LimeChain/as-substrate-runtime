import { Storage } from '@as-substrate/core-modules';
import { MINIMUM_PERIOD, SCALE_TIMESTAMP_DID_UPDATE, SCALE_TIMESTAMP_NOW } from './constants';
import { UInt64, Bool, ByteArray } from 'as-scale-codec';

export class Timestamp{    
    /**
     * Sets the current time. When setting the new time, 
     * it must be greater than the last one (set into storage) with at least a MinimumPeriod
     * @param now timestamp number
     */
    static set(now: u64): void {
        const didUpdate = Storage.get(SCALE_TIMESTAMP_DID_UPDATE);
        assert(!didUpdate.isSome(), 'Timestamp must be updated only once in the block')

        const prev: u64 = this.get();
        
        assert(prev != 0 || now >= prev + MINIMUM_PERIOD, 
            'Timestamp must increment by at least <MinimumPeriod> between sequential blocks');

        const nowu8 = new UInt64(now);
        const trueu8 = new Bool(true);
        Storage.set(SCALE_TIMESTAMP_NOW, nowu8.toU8a());
        Storage.set(SCALE_TIMESTAMP_DID_UPDATE, trueu8.toU8a());
    }
    /**
     *  Gets the current time that was set. If this function is called prior 
     *  to setting the timestamp, it will return the timestamp of the previous block.
     */
    static get(): u64 {
        const now = Storage.get(SCALE_TIMESTAMP_NOW);
        const res = now.isSome() ? (<ByteArray>now.unwrap()).values : [4, 0];
        const val: UInt64 = UInt64.fromU8a(res);
        return val.value;
    }
}