const axios = require("axios").default;
const RpcCall = require('./rpc-call');
const Utils = require('./utils');
const { u8aToHex, hexToU8a } = require('@polkadot/util');
const { UInt, TypeRegistry, Compact } = require("@polkadot/types");

/**
 * U64 type as per scale-codec
 */
const U64 = UInt.with(64, "U64");
const U128 = UInt.with(128, "U128");

/**
 * A class that represents a substrate node
 */
class NodeClient {
    static baseUrl = "http://localhost";
    constructor(port, validator) {
        this.nodeUrl = `${NodeClient.baseUrl}:${port}`;
        this.validator = validator;
    }

    /**
     * Insert aura key for this node
     */
    insertAuraKey(publicKey, mnemonic){
        if(!this.validator){
            return "Node is not a validator";
        }
        const params = [
            "aura", mnemonic, publicKey
        ];
        const rpcCall = new RpcCall("author_insertKey", params);
        return axios.post(this.nodeUrl, rpcCall.toJson());
    }
    /**
     * Get the balance of the given account
     * @param {*} account 
     */
    async getBalance(account) {
        const rpcCall = new RpcCall("state_getStorage", [account]);
        const { data } = await axios.post(this.nodeUrl, rpcCall.toJson());
        const [len, value] = Compact.decodeU8a(hexToU8a(data.result));
        return data.result ? new U128(TypeRegistry, value) : data.error;
    }
    /**
     * Get the latest used nonce for the account
     * @param {*} account 
     */
    async getNonce(account){
        const rpcCall = new RpcCall("state_call", ["System_account_nonce", account]);
        const { data } = await axios.post(this.nodeUrl, rpcCall.toJson());
        return new U64(TypeRegistry, hexToU8a(data.result));
    }
    /**
     * Get the latest block's header
     */
    async getHead(){
        const rpcCall = new RpcCall("chain_getHead", []);
        const { data } = await axios.post(this.nodeUrl, rpcCall.toJson());
        return data.result;
    }
    /**
     * Delay function that waits for previous transaction to be mined
     */
    waitForHead() {
        return new Promise(async (resolve, reject) => {
            const currentHead = await this.getHead();
            this._waitHead(currentHead, resolve);
        });
    }
    
    _waitHead(currentHead, resolve) {
        setTimeout(async () => {
            const head = await this.getHead();
            if (head != currentHead) {
                resolve();
            } else {
                this._waitHead(currentHead, resolve)
            }
        }, 500);
    }

    /**
     * 
     * @param {*} to 
     * @param {*} amount 
     * @param {*} privateKey 
     */
    async transfer(to, amount, privateKey){
        amount = u8aToHex((new U64(TypeRegistry, amount)).toU8a());
        const from = await Utils.getKeyringPair(privateKey);
        const nonce = await this.getNonce(u8aToHex(from.publicKey));
        const nextNonce = new U64(TypeRegistry, nonce.toNumber() + 1);
        const signedTx = Utils.signTransaction(from, to, amount, u8aToHex(nextNonce.toU8a()));
        const rpcCall = new RpcCall("author_submitExtrinsic", [signedTx]);
        const { data } = await axios.post(this.nodeUrl, rpcCall.toJson());
        return data;
    }
    /**
     * Unsafe transfer, i.e missing some transaction properties
     * @param {*} to 
     * @param {*} amount 
     * @param {*} nonce 
     * @param {*} privateKey 
     */
    async unsafeTransfer(to, amount, nonce, privateKey){
        const from = await Utils.getKeyringPair(privateKey);
        const rawNonce = nonce ? u8aToHex((new U64(TypeRegistry, nonce)).toU8a()) : "0x";
        const rawAmount = amount ? u8aToHex((new U64(TypeRegistry, amount)).toU8a()) : "0x";
        const signedTx = Utils.signTransaction(from, to, rawAmount, rawNonce);
        const rpcCall = new RpcCall("author_submitExtrinsic", [signedTx]);
        const { data } = await axios.post(this.nodeUrl, rpcCall.toJson());
        return data;
    }
}

module.exports = NodeClient;