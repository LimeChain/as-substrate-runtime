const { stringToHex } = require('@polkadot/util');

const systemToRaw = (system) => {
    const systemRaw = Object.entries(system).map(pair => {
        if(pair[0] == 'code'){
            return [stringToHex([pair[0]]), pair[1]];
        }
        return [stringToHex(pair[0]), stringToHex(pair[1])];
    })
    return systemRaw;
}

module.exports = {
    systemToRaw
}