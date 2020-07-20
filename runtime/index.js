const fs = require("fs");
const loader = require("@assemblyscript/loader");
const imports = {
    ext_storage_get: function () {

    }
};
const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/untouched.wasm"), imports);
console.log(wasmModule.exports);