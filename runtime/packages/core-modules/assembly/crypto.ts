import { Signature } from '@as-substrate/models';
import { AccountId } from '@as-substrate/balances-module';
import { ext_crypto_sr25519_verify_version_2, ext_trie_blake2_256_ordered_root_version_1 } from '.';
import { Serialiser } from '@as-substrate/core-utils';
import { Hash } from 'as-scale-codec';
import { Log } from './log';

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

    export function computeExtrinsicRoot(data: u8[][]):Hash{
        Log.info("computing started");
        let dataPtr = data.dataStart;
        let dataLen = data.length;
        __retain(dataPtr);
        const dataU64 = ((dataLen as u64) << 32) | dataPtr;
        Log.info("computing midway");
        let extrinsicRoot: i32 = ext_trie_blake2_256_ordered_root_version_1(dataU64);
        Log.info("computing successfull"); 
        const hashU8a = Serialiser.deserialiseInput(extrinsicRoot, 32);
        Log.info("decoding successfull"); 
        return Hash.fromU8a(hashU8a);
    }
}