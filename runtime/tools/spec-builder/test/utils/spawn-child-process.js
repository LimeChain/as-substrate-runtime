const { spawn } = require('child_process');

/**
 * Utils class with methods that help to run cli program 
 * */ 

class Utils{
    /**
     * Runs build-spec command as a child process
     * @param file to read
     * @param output file to write raw json 
     */
    static buildSpec(file, output, wasmCode) {
        return new Promise(function(resolve, reject) {
            const defaults = {
                cwd: process.cwd(),
                env: process.env
            }
            const command = spawn('node', ['index.js', '-f', file, '-o', output, '-c', wasmCode], defaults);

            command.stderr.setEncoding('utf-8');
            
            command.stderr.on('data', function(data) {
                resolve(data);
            })
            command.on('error', function(error){
                reject(error);
            })
            command.on('close', function(code){
                resolve(code);
            })
        })
    }

    /**
     * Removes generated raw files
     */
    static emptyActualRawFiles() {
        return new Promise(function(resolve, reject) {

            const args = ['-rf', 
                'test/actual-raw-files/customSpecRaw.json', 
                'test/actual-raw-files/customSpecRaw-code.json',
                'test/actual-raw-files/customSpecRaw-noAura.json'
            ]

            const command = spawn('rm', args);

            command.stderr.setEncoding('utf-8');
            
            command.stderr.on('data', function(data){
                resolve(data);
            })
            command.on('error', function(error) {
                reject(error);
            })
            command.on('close', function(code){
                resolve(code);
            })
        })
    }
}
module.exports = Utils;