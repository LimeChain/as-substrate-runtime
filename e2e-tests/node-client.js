const axios = require("axios").default;
const RpcCall = require('./rpc-call');
const Utils = require('./utils');
const { stringToU8a, u8aToHex } = require('@polkadot/util');
const { UInt, TypeRegistry } = require("@polkadot/types");
/**
 * A class that represents a substrate node
 */
class NodeClient {
    static baseUrl = "http://localhost";
    static transactionLength = 145;
    constructor(port, validator, publicKey) {
        this.nodeUrl = `${NodeClient.baseUrl}:${port}`;
        this.validator = validator;
        this.publicKey = publicKey;
    }

    /**
     * Insert aura key for this node
     */
    async insertAuraKey(mnemonic){
        if(!this.validator){
            return "Node is not a validator";
        }
        const params = [
            "aura", mnemonic, this.publicKey
        ];
        const rpcCall = new RpcCall("author_insertKey", params);
        return await axios.post(this.nodeUrl, rpcCall.toJson());
    }

    /**
     * Get state of the network, i.e peerId, connected peers, etc.
     */
    async getConnectedPeers() {
        const rpcCall = new RpcCall("system_networkState", []);
        console.log(rpcCall.toJson());
        const { data, error } = await axios.post(this.nodeUrl, rpcCall.toJson());
        return data ? data.result.connectedPeers : error;
    }

    async getBalance(account) {
        const rpcCall = new RpcCall("state_getStorage", [account]);
        const { data, error } = await axios.post(this.nodeUrl, rpcCall.toJson());
        return data ? data.result : error;
    }   

    async getNonce(){
        const nonceKey = this.publicKey + u8aToHex(stringToU8a("nonce")).slice(2);
        const rpcCall = new RpcCall("state_getStorage", [nonceKey]);
        const { data } = await axios.post(this.nodeUrl, rpcCall.toJson());
        return data.result;
    }

    async transfer(to, amount, privateKey){
        const rawNonce = await this.getNonce();
        const U64 = UInt.with(64, "U64");
        let nonce = rawNonce ? rawNonce : 1;
        const tx = {
            from: this.publicKey,
            to: to,
            amount: u8aToHex((new U64(TypeRegistry, amount)).toU8a()),
            nonce: u8aToHex((new U64(TypeRegistry, nonce)).toU8a())
        };
        const signedTx = await Utils.signTransaction(tx, privateKey);
        console.log(signedTx);
        const rpcCall = new RpcCall("author_submitExtrinsic", [signedTx]);
        const { data } = await axios.post(this.nodeUrl, rpcCall.toJson());
        return data;
    }
}

module.exports = NodeClient;