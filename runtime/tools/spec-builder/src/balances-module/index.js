const { } = require('../wasm-loader');
const { __retain, __getUint8Array, __allocArray, __release, getAccountDataBytes, UInt8Array_ID  } = require('../wasm-loader');
const { Compact } = require('@polkadot/types');
const { u8aToHex, stringToHex } = require('@polkadot/util');

class Balances{
    balances = [];
    constructor(balances){
        this.balances = balances;
    }

    /**
     * 
     * @param balances array with accountId and balances
     */
    static toRaw(balancesObj){
        const rawBalances = balancesObj.balances.map(data => {
            const key = stringToHex(data[0]);
            const value = accDataToHex(data[1].toString());
            return [key, value]
        })
        return rawBalances;
    }
}

/**
 * 
 * @param value encodes AccountData instance to hex
 */
const accDataToHex = (value) => {
    const val = Compact.encodeU8a(value);
    let sPtr = __retain(__allocArray(UInt8Array_ID ,val));
    const accData = getAccountDataBytes(sPtr);
    const res = __getUint8Array(accData);
    __release(sPtr);
    __release(accData);
    return u8aToHex(res);
}

module.exports = {
    Balances
}