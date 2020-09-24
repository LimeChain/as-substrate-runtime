import { Signature } from '@as-substrate/models';
import { AccountId } from '@as-substrate/balances-module';
import { ext_crypto_sr25519_verify_version_2 } from '.';
import { Serialiser } from '@as-substrate/core-utils';

/**
 * Useful crypto related functions
 */
export namespace Crypto{
    /**
     * Verifies the message and signature of the extrinsic
     * @param signature 
     * @param msg message to be verified
     * @param sender 
     */
    export function verifySignature(signature: Signature, msg: u8[], sender: AccountId): bool{
        const serialisedSign: i32 = Serialiser.getPointerToBytes(signature.value);
        const serialiseMsg: u64 = Serialiser.serialiseResult(msg);
        const serialisedSender: i32 = Serialiser.getPointerToBytes(sender.getAddress());
        const result: i32 = ext_crypto_sr25519_verify_version_2(serialisedSign, serialiseMsg, serialisedSender);
        return result as bool;
    }
}