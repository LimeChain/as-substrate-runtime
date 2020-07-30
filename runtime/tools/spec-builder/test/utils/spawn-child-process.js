const { spawn } = require('child_process');

function buildSpec(file, output) {
    return new Promise(function(resolve, reject) {
        const defaults = {
            cwd: process.cwd(),
            env: process.env
        }
        const command = spawn('node', ['index.js', '-f', file, '-o', output], defaults);
    
        console.log(`generating raw json file ${output} ...`);
    
        command.stdout.on('data', (data) => {
            resolve(data);
        })
    
        command.stderr.on('error', (error) => {
            reject(error);
        })
        command.on('close', function(code){
            resolve(code);
        })
    })
}

function emptyActualRawFiles() {
    return new Promise(function(resolve, reject) {
        console.log('deleting all raw json files...');

        const command = spawn('rm', ['-rf', './test/actual-raw-files/*'])
        
        command.stdout.on('data', (data) => {
            resolve(data);
        })
        command.stdout.on('error', (error) => {
            reject(error);
        })
        command.on('close', function(code){
            resolve(code);
        })
    })
}

module.exports = {
    buildSpec,
    emptyActualRawFiles
};