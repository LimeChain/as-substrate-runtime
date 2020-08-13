const { u8aToHex } = require('@polkadot/util');
const { Keyring } = require('@polkadot/api');
const { __retain, __getUint8Array, __allocArray, __release, UInt8Array_ID, getAccountIdBytes, getAuraKey, UInt, __reset } = require('../wasm-loader');


class Aura {

    /**
     * Converts key&value pair to scale-encoded type
     * @param authorities list of authorities
     */
    static toRaw(authorities){
        let rawAuthorities = [];
        const key = u8aToHex(getAccIdKey());
        const keyring = new Keyring({ type: 'sr25519' });

        authorities.forEach(element => {
            const keyringInstance = keyring.addFromAddress(element);
            rawAuthorities = rawAuthorities.concat(Array.from(keyringInstance.publicKey));
        });
        const auths = getAuthoritiesBytes(rawAuthorities);
        console.log(auths);
        return {
            [key]: u8aToHex(auths)
        }
    }
}

/**
 * Get key for the Aura Authorities
 */
const getAccIdKey = () => {
    const keyData = getAuraKey();
    const res = __getUint8Array(keyData);
    __release(keyData);
    return res;
}

/**
 * Get scale encoded list of Aura authorities
 *  @param authorities list of authorities
 */
const getAuthoritiesBytes = (authorities) => {
    const aPtr = __retain(__allocArray(UInt8Array_ID, authorities));
    const auths = getAccountIdBytes(aPtr);
    const result = __getUint8Array(auths);
    console.log(result);
    __release(aPtr);
    __release(auths);
    return result;
}

module.exports = Aura;