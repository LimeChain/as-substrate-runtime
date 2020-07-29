const { Balances } = require("./balances-module");
const { System } = require("./system-module");

/**
 * Class for the genesis configuration
 */
class GenesisBuilder{
    genesis = {};

    constructor(genesis){
        this.genesis = genesis;
    }
    
    /**
     * Converts genesis property of the class to Raw
     * @param genesis instance of class 
     */
    static toRaw(genBuilder) {
        const rawGenesis = {
            raw: {
                top: {}
            }
        };
        const balances = genBuilder.genesis.runtime.balances;
        const system = genBuilder.genesis.runtime.system;
        let rawData = [];
        rawData = rawData.concat(Balances.toRaw(new Balances(balances.balances)));
        rawData = rawData.concat(System.toRaw(new System(system.changeTriesConfig, system.code)));
        
        rawData.map(pair => {
            rawGenesis.raw.top[pair[0]] = pair[1];
        })

        return new GenesisBuilder(
            rawGenesis
        );
    }

    static fromJson(json){
        const {name, id, chainType, bootNodes, telemetryEndpoints, protocolId, properties, consensusEngine, ...genesis} = json;
        return Object.assign(new GenesisBuilder(), genesis);
    }

    static toJson(genesis) {
        // TO-DO
    }
}

module.exports = {
    GenesisBuilder
}