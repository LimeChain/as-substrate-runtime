const { Keyring } = require("@polkadot/api");
const { Compact } = require("@polkadot/types");
const { hexToU8a, u8aToHex } = require('@polkadot/util');
const { cryptoWaitReady } = require('@polkadot/util-crypto');

cryptoWaitReady()
    .then((res) => {return ;});

class Utils {
    static TRANSACTION_LENGTH = 145;

    /**
     * Get Keyring pair prom private key
     * @param {*} privateKey 
     */
    static async getKeyringPair(privateKey){
        const keyring = new Keyring({ type: 'sr25519' });
        return keyring.addFromSeed(hexToU8a(privateKey));
    }

    /**
     * Sign the transaction with Keyring pair
     * @param {*} from 
     * @param {*} to 
     * @param {*} amount 
     * @param {*} nonce 
     */
    static signTransaction(from, to, amount, nonce){
        const tx = {
            from: u8aToHex(from.publicKey),
            to,
            amount,
            nonce
        };
        let concatStr = "";
        Object.values(tx).forEach(value => {
            concatStr += this._saveRemove0x(value.toString());
        });
        const signature = from.sign(this._saveAdd0x(concatStr));
        // add exhaustResources property at the end
        concatStr = concatStr + this._saveRemove0x(u8aToHex(signature)) + "00";
        const len = Compact.encodeU8a(concatStr.length/2);
        concatStr = u8aToHex(len) + concatStr;
        return this._saveAdd0x(concatStr);
    }

    /**
     * Remove 0x prefix of Hex string
     * @param {} str 
     */
    static _saveRemove0x(str){
        return str.startsWith("0x") ? str.slice(2) : str;
    }
    /**
     * Add 0x prefix to a string 
     * @param {*} str 
     */
    static _saveAdd0x(str){
        return str.startsWith("0x") ? str : "0x" + str;
    }
}

module.exports = Utils;