const Balances = require("./modules/balances");
const System = require("./modules/system");

/**
 * Class for the genesis configuration
 */
class GenesisBuilder {
    
    /**
     * Converts genesis property of the class to Raw
     * @param genesis instance of class 
     */
    static toRaw(genesisConfig) {
        const rawGenesis = {
            raw: {
                top: {
                }
            }
        };

        // Checking the provided structure - .genesis.runtime.balances exits f.e or .system
        const system = genesisConfig.genesis.runtime.system;
        const balances = genesisConfig.genesis.runtime.balances;

        const rawSystem = System.toRaw(system);
        const rawBalances = Balances.toRaw(balances.balances);

        Object.assign(rawGenesis.raw.top, rawSystem);
        Object.assign(rawGenesis.raw.top, rawBalances);

        return rawGenesis;
    }
}

module.exports = GenesisBuilder