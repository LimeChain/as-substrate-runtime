
class NodeClient {

    constructor(url) {

    }

    // ADD any reusable rpc calls
    async static get(url) {
        // do an RPC call for get status or smth like that
        // if its okay -> return new NodeClient() instance
        // if not throw
    }

    async getBlock() {
        // return the current block of the node
    }

    async getBalance(account) {
        // return the balance of the account
    }
}

module.exports = NodeClient