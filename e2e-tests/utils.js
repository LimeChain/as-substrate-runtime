const { Keyring } = require("@polkadot/api");
const { Compact } = require("@polkadot/types");
const { hexToU8a, u8aToHex } = require('@polkadot/util');
const { cryptoWaitReady } = require('@polkadot/util-crypto');
class Utils {
    static TRANSACTION_LENGTH = 145;


    static async signTransaction(tx, privateKey){
        const keyring = new Keyring({ type: 'sr25519' });
        const len = Compact.encodeU8a(Utils.TRANSACTION_LENGTH);
        await cryptoWaitReady();
        const from = keyring.addFromSeed(hexToU8a(privateKey));
        let concatStr = "0x";
        Object.values(tx).forEach(value => {
            concatStr += value.slice(2);
        });
        console.log(concatStr);
        const signature = from.sign(concatStr);
        concatStr = u8aToHex(len) + concatStr.slice(2);
        return concatStr.concat([u8aToHex(signature).slice(2) + "00"]);
    }
}

module.exports = Utils;