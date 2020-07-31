import { ScaleString } from 'as-scale-codec';

const timestamp: ScaleString = new ScaleString('timestamp');
const now: ScaleString = new ScaleString('now');

const didUpdate: ScaleString = new ScaleString('didupdate');

export const MINIMUM_PERIOD: u64 = 5;
export const SCALE_TIMESTAMP_NOW: u8[] = timestamp.toU8a().concat(now.toU8a());
export const SCALE_TIMESTAMP_DID_UPDATE: u8[] = timestamp.toU8a().concat(didUpdate.toU8a());
