const { spawn } = require('child_process');

class Utils{
    static buildSpec(file, output) {
        return new Promise(function(resolve, reject) {
            const defaults = {
                cwd: process.cwd(),
                env: process.env
            }
            const command = spawn('node', ['index.js', '-f', file, '-o', output], defaults);
        
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

    static emptyActualRawFiles() {
        return new Promise(function(resolve, reject) {

            const args = ['-rf', 
                'test/actual-raw-files/customSpecRaw.json', 
                'test/actual-raw-files/customSpecRaw-code.json'
            ]

            const command = spawn('rm', args);

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
}
module.exports = Utils;