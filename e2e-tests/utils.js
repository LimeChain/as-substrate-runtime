const { Keyring } = require("@polkadot/api");
const { Compact } = require("@polkadot/types");
const { hexToU8a, u8aToHex } = require('@polkadot/util');
const { cryptoWaitReady } = require('@polkadot/util-crypto');
class Utils {
    static TRANSACTION_LENGTH = 145;

    /**
     * Get Keyring pair prom private key
     * @param {*} privateKey 
     */
    static async getKeyringPair(privateKey){
        const keyring = new Keyring({ type: 'sr25519' });
        await cryptoWaitReady();
        const pair = keyring.addFromSeed(hexToU8a(privateKey));
        return pair;
    }

    /**
     * Sign the transaction with Keyring pair
     * @param {*} from 
     * @param {*} to 
     * @param {*} amount 
     * @param {*} nonce 
     */
    static async signTransaction(from, to, amount, nonce){
        const len = Compact.encodeU8a(Utils.TRANSACTION_LENGTH);
        const tx = {
            from: u8aToHex(from.publicKey),
            to,
            amount,
            nonce
        };
        let concatStr = "0x";
        Object.values(tx).forEach(value => {
            concatStr += value.slice(2);
        });
        const signature = from.sign(concatStr);
        concatStr = u8aToHex(len) + concatStr.slice(2);
        return concatStr.concat([u8aToHex(signature).slice(2) + "00"]);
    }
}

module.exports = Utils;