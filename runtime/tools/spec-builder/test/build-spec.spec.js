const assert = require('assert');
const fs = require('fs');
const Utils= require('./utils/spawn-child-process');

describe('Build spec tests', () => {
    before(async function() {
        await Utils.emptyActualRawFiles();
    });

    describe('Build spec generates correct raw outputs', function() {

        it('correctly converts customSpec with all properties', async function() {
            await Utils.buildSpec('./test/json-files/customSpec.json', './test/actual-raw-files/customSpecRaw.json');
            
            assert(fs.existsSync('./test/actual-raw-files/customSpecRaw.json'), 'file does not exist');
            
            const actualRaw = require('./actual-raw-files/customSpecRaw.json');
            const expectedRaw = require('./expected-raw-files/customSpecRaw.json');

            assert.deepEqual(actualRaw, expectedRaw);
        })

        it('correctly converts customSpec with system property only', async function() {
            await Utils.buildSpec('./test/json-files/customSpec-code.json', './test/actual-raw-files/customSpecRaw-code.json');
            
            assert(fs.existsSync('./test/actual-raw-files/customSpecRaw-code.json'), 'file does not exist');
            
            const actualRaw = require('./actual-raw-files/customSpecRaw-code.json');
            const expectedRaw = require('./expected-raw-files/customSpecRaw-code.json');
            
            assert.deepEqual(actualRaw, expectedRaw);
        })

        it('should fail to convert customSpec without system property', async function() {
            await Utils.buildSpec('./test/json-files/customSpec-balances.json', './test/actual-raw-files/customSpecRaw-balances.json');

            assert(!fs.existsSync('./test/actual-raw-files/customSpecRaw-balances.json'), 'file exists');
        })

        it('should fail if there is no genesis property', async function(){
            const code = await Utils.buildSpec('./test/json-files/customSpec-noGenesis.json', './test/actual-raw-files/customSpecRaw-noGenesis.json')
            assert.equal(code, 1, 'exit code is not 1');
        })


        it('should fail if there is empty balances array', async function(){
            const code = await Utils.buildSpec('./test/json-files/customSpec-noBalances.json', './test/actual-raw-files/customSpecRaw-noBalances.json')
            assert.equal(code, 1, 'exit code is not 1');
        })

        it('should fail if there is no runtime property', async function(){
            const code = await Utils.buildSpec('./test/json-files/customSpec-noRuntime.json', './test/actual-raw-files/customSpecRaw-noRuntime.json')
            assert.equal(code, 1, 'exit code is not 1');
        })

    })

    after(async function() {
        await Utils.emptyActualRawFiles();
    })
})