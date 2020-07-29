const { GenesisBuilder } = require('./src/genesisBuilder');
const fs = require('fs');

const cS = JSON.parse(fs.readFileSync("./customSpec.json"));

const customSpec = GenesisBuilder.fromJson(cS);

const rawJson = GenesisBuilder.toRaw(customSpec);
fs.writeFileSync('./customSpecRaw.json', JSON.stringify(rawJson, null, 2));

console.log("succesfully converted to raw json");