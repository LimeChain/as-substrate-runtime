import { UInt128, CompactInt } from 'as-scale-codec';
import { AccountData, AccountId } from '@as-substrate/balances-module';
import { Utils } from '@as-substrate/core-utils';
import { AuraModule } from '@as-substrate/aura-module';

/**
 * Gets the AccountData converted to the bytes
 * @param freeBalance free balance for the AccountData
 */
export function getAccountDataBytes(freeBalance: Uint8Array): u8[] {
  const free = UInt128.fromU8a(Utils.toU8Array(freeBalance));
  const accData = new AccountData(free, UInt128.Zero);
  return accData.toU8a();
}


/**
 * 
 * @param authorities list of authorities in bytes
 */
export function getAccountIdBytes(authorities: Uint8Array): u8[] {
  let input = Utils.toU8Array(authorities);
  let auths: u8[] = [];
  let counter = 0;
  
  while (input.length != 0){
    let accId = AccountId.fromU8Array(input);
    auths = auths.concat(accId.result.address);
    input = accId.input;
    counter += 1;
  }

  let result: u8[] = [];
  const length = new CompactInt(counter);
  return result.concat(length.toU8a())
    .concat(auths);
}

/**
 * Get scale encoded key for storing Aura Authorities
 */
export function getAuraKey(): u8[] {
  return AuraModule.AURA_AUTHORITIES;
}

export const UInt8Array_ID = idof<Uint8Array>();