const axios = require("axios").default;
const RpcCall = require('./rpc-call');

/**
 * A class that represents a substrate node
 */
class NodeClient {
    static baseUrl = "http://localhost";
    constructor(port, name, publicKey, mnemonic, validator) {
        this.nodeUrl = `${this.nodeUrl}:${port}`;
        this.name = name;
        this.publicKey = publicKey;
        this.mnemonic = mnemonic;
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
    async getNetworkState() {
        const rpcCall = new RpcCall("system_networkState", []);
        return await axios.post(this.nodeUrl, rpcCall.toJson);
    }

    async getBlockHash(number) {
        const 
    }

    async getBalance(account) {
        // return the balance of the account
    }
}

module.exports = NodeClient;