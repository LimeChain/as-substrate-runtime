yarn --cwd ../runtime run build && cp ../runtime/wasm-code .
rm -rf /tmp/node0*
#!/usr/bin/env bash
hex="0x"
result=${hex}$( cat wasm-code )
cat customSpecRaw.json | jq --arg res "${result}" '.genesis.raw.top."0x3a636f6465" |= $res' | tee customSpecRaw.json > /dev/null