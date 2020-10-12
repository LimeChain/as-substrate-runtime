const { Keyring } = require("@polkadot/api");
const { Compact } = require("@polkadot/types");
const { hexToU8a, u8aToHex, hexAddPrefix, hexStripPrefix } = require('@polkadot/util');

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
            concatStr += hexStripPrefix(value.toString());
        });
        const signature = from.sign(hexAddPrefix(concatStr));
        // add exhaustResources property at the end
        concatStr = concatStr + hexStripPrefix(u8aToHex(signature)) + "00";
        // each hexadecimal digit represents 4 bits
        const len = Compact.encodeU8a(concatStr.length/2);
        concatStr = u8aToHex(len) + concatStr;
        return hexAddPrefix(concatStr);
    }
}

module.exports = Utils;