#!/usr/bin/env bash
hex="0x"
result=${hex}$( cd runtime && cat wasm-code )
cat customSpec.json | jq --arg res "${result}" '.genesis.runtime.system.code |= $res' > customSpec.json