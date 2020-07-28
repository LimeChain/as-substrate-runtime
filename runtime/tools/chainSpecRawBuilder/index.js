const { CustomSpec } = require('./src/customSpec');
const fs = require('fs');

const cS = JSON.parse(fs.readFileSync("./customSpec.json"));

const customSpec = CustomSpec.fromJson(cS);

const rawJson = CustomSpec.toRaw(customSpec);

fs.writeFileSync('./customSpecRaw.json', JSON.stringify(rawJson, null, 2));

console.log("succesfully converted to raw json");