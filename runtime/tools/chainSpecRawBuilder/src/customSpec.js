const { balancesToRaw } = require("./balances-module");
const { systemToRaw } = require("./system-module");

/**
 * Class for the customSpec genesis configuration
 */
class CustomSpec{
    name = "";
    id = "local_testnet";
    chainType =  "Local";
    bootNodes = [];
    telemetryEndpoints = null;
    protocolId = null;
    properties = null;
    consensusEngine = null;
    genesis = {};

    constructor(
        name, id, chainType, bootNodes, 
        telemetryEndpoints, protocolId, properties,
        consensusEngine, genesis
        ){
            this.name = name;
            this.id = id;
            this.chainType = chainType;
            this.bootNodes = bootNodes;
            this.telemetryEndpoints = telemetryEndpoints;
            this.protocolId = protocolId;
            this.properties = properties;
            this.consensusEngine = consensusEngine;
            this.genesis = genesis;
        }
    
    /**
     * Converts genesis property of the class to Raw
     * @param customSpec instance of class 
     */
    static toRaw(customSpec) {
        const rawGenesis = {
            raw: {
                top: {}
            }
        };
        let rawData = [];
        rawData = rawData.concat(balancesToRaw(customSpec.genesis.runtime.balances.balances));
        rawData = rawData.concat(systemToRaw(customSpec.genesis.runtime.system));
        
        rawData.map(pair => {
            rawGenesis.raw.top[pair[0]] = pair[1];
        })

        return new CustomSpec(
            customSpec.id,
            customSpec.name,
            customSpec.chainType,
            customSpec.bootNodes,
            customSpec.telemetryEndpoints,
            customSpec.protocolId,
            customSpec.properties,
            customSpec.consensusEngine,
            rawGenesis
        );
    }

    static fromJson(json){
        return Object.assign(new CustomSpec(), json);
    }

    static toJson(customSpec) {
        // TO-DO
    }
}

module.exports = {
    CustomSpec
}