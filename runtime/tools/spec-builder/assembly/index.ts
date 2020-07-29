import { UInt128 } from 'as-scale-codec';
import { AccountData } from '@as-substrate/balances-module';
import { Utils } from '@as-substrate/core-utils';


/**
 * Gets the AccountData converted to the bytes
 * @param freeBalance free balance for the AccountData
 */
export function getAccountDataBytes(freeBalance: Uint8Array): u8[] {
  const free = UInt128.fromU8a(Utils.toU8Array(freeBalance));
  const accData = new AccountData(free, UInt128.Zero)
  return accData.toU8a();
}

export const UInt8Array_ID = idof<Uint8Array>();