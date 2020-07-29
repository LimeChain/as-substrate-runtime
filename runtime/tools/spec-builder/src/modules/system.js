const { stringToHex } = require('@polkadot/util');

/**
 * The well known key :CODE
 */
const CODE = ":code";

class System {

    /**
     * Converts the system instance to raw object
     * @param system instance of the class 
     */
    static toRaw(system) {
        if (!system.code) {
            throw new Error("Code property is not populated");
        }
        return { [stringToHex(CODE)]: system.code }
    }
}

module.exports = System