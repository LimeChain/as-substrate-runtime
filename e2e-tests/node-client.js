const axios = require("axios").default;
const RpcCall = require('./rpc-call');
const Utils = require('./utils');
const { u8aToHex } = require('@polkadot/util');
const { UInt, TypeRegistry } = require("@polkadot/types");
/**
 * A class that represents a substrate node
 */
class NodeClient {
    static baseUrl = "http://localhost";
    static transactionLength = 145;
    constructor(port, validator) {
        this.nodeUrl = `${NodeClient.baseUrl}:${port}`;
        this.validator = validator;
    }

    /**
     * Insert aura key for this node
     */
    async insertAuraKey(publicKey, mnemonic){
        if(!this.validator){
            return "Node is not a validator";
        }
        const params = [
            "aura", mnemonic, publicKey
        ];
        const rpcCall = new RpcCall("author_insertKey", params);
        return await axios.post(this.nodeUrl, rpcCall.toJson());
    }
    /**
     * Get the balance of the given account
     * @param {*} account 
     */
    async getBalance(account) {
        const rpcCall = new RpcCall("state_getStorage", [account]);
        const { data, error } = await axios.post(this.nodeUrl, rpcCall.toJson());
        return data ? data.result : error;
    }

    async getNonce(account){
        const rpcCall = new RpcCall("state_call", ["System_account_nonce", account]);
        const { data } = await axios.post(this.nodeUrl, rpcCall.toJson());
        return data.result;
    }

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
        const U64 = UInt.with(64, "U64");
        amount = u8aToHex((new U64(TypeRegistry, amount)).toU8a());
        const from = await Utils.getKeyringPair(privateKey);
        const nonce = await this.getNonce(u8aToHex(from.publicKey));
        const signedTx = await Utils.signTransaction(from, to, amount, nonce);
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
        const U64 = UInt.with(64, "U64");
        amount = u8aToHex((new U64(TypeRegistry, amount)).toU8a());
        const signedTx = await Utils.signTransaction(from, to, amount, nonce);
        const rpcCall = new RpcCall("author_submitExtrinsic", [signedTx]);
        const { data } = await axios.post(this.nodeUrl, rpcCall.toJson());
        return data;
    }
}

module.exports = NodeClient;