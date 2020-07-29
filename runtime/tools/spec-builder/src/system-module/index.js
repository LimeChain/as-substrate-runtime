const { stringToHex } = require('@polkadot/util');


class System{

    changesTrieConfig = null;
    code = "";
    static CODE = ":code";
    constructor(changesTrieConfig, code){
        this.changesTrieConfig = changesTrieConfig;
        this.code = code;
    }

    /**
     * Converts the system instance to raw object
     * @param system instance of the class 
     */
    static toRaw(system) {
        if (!system.code) {
            throw new Error("Code property is not populated");
        }
        const systemRaw = Object.entries(system).map(pair => {
            if(pair[0] == 'code'){
                return [stringToHex(this.CODE), pair[1]];
            }
            return [stringToHex(pair[0]), stringToHex(pair[1])];
        })
        return systemRaw;
    }
}

module.exports = {
    System
}