// The entry file of your WebAssembly module.
import { UInt128 } from 'as-scale-codec';
import { AccountData } from '@as-substrate/balances-module';
import { Utils } from '@as-substrate/core-utils';

export function getAccData(value: Uint8Array): u8[] {
  const free = UInt128.fromU8a(Utils.toU8Array(value));
  const accData = new AccountData(free, UInt128.Zero)
  return accData.toU8a();
}

export const UInt8Array_ID = idof<Uint8Array>();