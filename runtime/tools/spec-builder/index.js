#!/usr/bin/env node
const GenesisBuilder = require('./src/genesis-builder');
const fs = require('fs');
const curPath = process.cwd();

let argv = require('yargs')
    .usage('\n \n Usage: $0 [options]')
    .example('$0 -f customSpec.json -o customSpecRaw.json', 'convert given file to raw and write to output')
    .option('f', 
    {
        alias: 'file',
        describe: 'input file',
        demandOption: true
    })
    .option('o', {
        alias: 'output',
        describe: 'output file'
    })
    .fail(function (msg, err, yargs){
        if(err) throw err
        process.exit(1)
    })
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2020 Limehchain LTD. \n')
    .argv;


if(!fs.existsSync(`${curPath}/${argv.file}`)){
    console.log(`Error: ${argv.file} doesn't exist at the provided path: ${curPath}/${argv.file}`);
    return;
}

let customSpec = require(`${curPath}/${argv.file}`);

const rawGenesis = GenesisBuilder.toRaw(customSpec);

customSpec.genesis = rawGenesis;

// set default file to write, if output file isn't provided
const outputFile = argv.output ? argv.output : `${curPath}/customSpecRaw.json`;
fs.writeFileSync(outputFile, JSON.stringify(customSpec, null, 2));

console.log("succesfully converted to raw json");