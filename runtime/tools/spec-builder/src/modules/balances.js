const { } = require('../wasm-loader');
const { __retain, __getUint8Array, __allocArray, __release, getAccountDataBytes, UInt8Array_ID } = require('../wasm-loader');
const { Keyring } = require('@polkadot/api');
const { Compact } = require('@polkadot/types');
const { u8aToHex } = require('@polkadot/util');

class Balances {

    /**
     * 
     * @param balances array with accountId and balances
     */
    static toRaw(balancesArray) {
        if (!balancesArray) {
            throw new Error("Balances: No balances array provided")
        }
        const rawBalances = {};
        const keyring = new Keyring({ type: 'sr25519' });
        balancesArray.forEach(balanceArray => {
            const keyringInstance = keyring.addFromAddress(balanceArray[0]);
            const key = u8aToHex(keyringInstance.publicKey);
            const value = accDataToHex(balanceArray[1].toString());
            rawBalances[key] = value;
        });
        return rawBalances;
    }
}

/**
 * 
 * @param value encodes AccountData instance to hex
 */
const accDataToHex = (value) => {
    const val = Compact.encodeU8a(value);
    let sPtr = __retain(__allocArray(UInt8Array_ID, val));
    const accData = getAccountDataBytes(sPtr);
    const res = __getUint8Array(accData);
    __release(sPtr);
    __release(accData);
    return u8aToHex(res);
}

module.exports = Balances