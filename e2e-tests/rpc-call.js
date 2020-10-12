// Custom class for rpc call
class RpcCall{
    constructor(method, params){
        this.method = method;
        this.params = params;
    }

    toJson(){
        return {
            jsonrpc : "2.0",
            method: this.method,
            params: this.params,
            id: 1
        }
    }
}

module.exports = RpcCall;