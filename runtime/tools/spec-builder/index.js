const fs = require('fs');
const GenesisBuilder = require('./src/genesis-builder');
const customSpec = require('./customSpec.json');

const rawJson = GenesisBuilder.toRaw(customSpec);
fs.writeFileSync('./customSpecRaw.json', JSON.stringify(rawJson, null, 2));

console.log("succesfully converted to raw json");