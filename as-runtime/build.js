const fs = require("fs");
const WASM_FILE = fs.readFileSync(__dirname + "/build/optimized.wasm");
const byteArray = new Uint8Array(WASM_FILE);

const result = toHexString(byteArray);
const wasmCodeFile = JSON.stringify({ code: result });
fs.writeFile('wasm-code.json', wasmCodeFile, 'utf8', () => {
    console.info("Successfully created WASM Code JSON");
});

function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}