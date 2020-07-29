#!/usr/bin/env node
const GenesisBuilder = require('./src/genesis-builder');
const fs = require('fs');
const curPath = process.cwd();

let argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('build-spec', 'Converts custom spec json file to raw')
    .example('$0 build-spec -f customSpec.json -o customSpecRaw.json', 'convert given file to raw and write to output')
    .alias({'f' : 'file', 'o' : 'output'})
    .nargs({'f' : 1, 'o': 1})
    .describe('f', 'Load a file')
    .demandOption(['f'])
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2020')
    .argv;

let customSpec = require(`${curPath}/${argv.file}`);
const rawGenesis = GenesisBuilder.toRaw(customSpec);

customSpec.genesis = rawGenesis;

// set default file to write, if output file isn't provided
const outputFile = argv.output ? argv.output : `${curPath}/customSpecRaw.json`;
fs.writeFileSync(outputFile, JSON.stringify(customSpec, null, 2));

console.log("succesfully converted to raw json");