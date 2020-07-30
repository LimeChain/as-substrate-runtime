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
        if (!(genesisConfig && genesisConfig.genesis && genesisConfig.genesis.runtime && genesisConfig.genesis.runtime.system)) {
            throw new Error('Invalid Genesis config provided');
        }
        if (genesisConfig.genesis.runtime.balances){
            if(!genesisConfig.genesis.runtime.balances.balances.length){
                throw new Error('Invalid or empty array provided to balances property')
            }
        }

        const rawGenesis = {
            raw: {
                top: {
                }
            }
        };

        const system = genesisConfig.genesis.runtime.system;
        const rawSystem = System.toRaw(system);
        Object.assign(rawGenesis.raw.top, rawSystem);

        // Add any Balances related raw data
        if (genesisConfig.genesis.runtime.balances) {
            const balances = genesisConfig.genesis.runtime.balances;
            const rawBalances = Balances.toRaw(balances.balances);
            Object.assign(rawGenesis.raw.top, rawBalances);
        }

        return rawGenesis;
    }
}

module.exports = GenesisBuilder