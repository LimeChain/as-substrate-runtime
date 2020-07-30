const assert = require('assert');
const fs = require('fs');
const { buildSpec, emptyActualRawFiles } = require('./utils/spawn-child-process');
const { isEqual } = require('lodash');


before(async function() {
    await emptyActualRawFiles();
    await buildSpec('./test/json-files/customSpec.json', './test/actual-raw-files/customSpecRaw.json');
    await buildSpec('./test/json-files/customSpec-balances.json', './test/actual-raw-files/customSpec-balances.json');
    await buildSpec('./test/json-files/customSpec-code.json', './test/actual-raw-files/customSpecRaw-code.json');
});

describe('Tool generates raw files', function(){
    it('successfully generates customSpec file with all properties', function(){
        assert(fs.existsSync('./test/actual-raw-files/customSpecRaw.json'), 'file does not exist');
    })
    it('successfully generates customSpec file with system property only', function(){
        assert(fs.existsSync('./test/actual-raw-files/customSpecRaw-code.json'), 'file does not exist');
    })
    it('should fail to convert customSpec without system property', function() {
        assert(!fs.existsSync('./test/actual-raw-files/customSpecRaw-balances.json'), 'file exists');
    })
})

describe('Build spec generates correct raw outputs', function() {
    it('correctly converts customSpec with all properties', function() {
        const actualRaw = require('./actual-raw-files/customSpecRaw.json');
        const expectedRaw = require('./expected-raw-files/customSpecRaw.json');
        assert(isEqual(actualRaw, expectedRaw), 'given objects are not equal');
    })
    it('correctly converts customSpec with system property only', function() {
        const actualRaw = require('./actual-raw-files/customSpecRaw-code.json');
        const expectedRaw = require('./expected-raw-files/customSpecRaw-code.json');
        assert(isEqual(actualRaw, expectedRaw), 'given objects are not equal');
    })
})