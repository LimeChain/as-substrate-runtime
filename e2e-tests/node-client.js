const axios = require("axios").default;
const RpcCall = require('./rpc-call');

/**
 * A class that represents a substrate node
 */
class NodeClient {
    static baseUrl = "http://localhost";
    constructor(port, validator) {
        this.nodeUrl = `${this.nodeUrl}:${port}`;
        this.validator = validator;
    }

    /**
     * Insert aura key for this node
     */
    async insertAuraKey(){
        if(!this.validator){
            return "Node is not a validator";
        }
        const params = [
            "aura", this.publicKey, this.mnemonic
        ];
        const rpcCall = new RpcCall("author_insertKey", params);
        const { data, error } = await axios.post(this.nodeUrl, rpcCall.toJson);
        return error ? error : data;
    }

    /**
     * Get state of the network, i.e peerId, connected peers, etc.
     */
    async getConnectedPeers() {
        const rpcCall = new RpcCall("system_networkState", []);
        const { data, error } = await axios.post(this.nodeUrl, rpcCall.toJson);
        return data.result.connectedPeers;
    }

    async getBlockHash(num) {
        const hexNumber = num.toString(16);
        const rpcCall = new RpcCall("chain_getBlockHash", [hexNumber]);
        return await axios.post(this.nodeUrl, rpcCall.toJson());
    }

    async getBalance(account) {
        const rpcCall = new RpcCall("state_getStorage", [account]);
        return await axios.post(this.nodeUrl, rpcCall.toJson());
    }
}

module.exports = NodeClient;