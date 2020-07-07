# Substrate Runtime in AssemblyScript (WIP)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Substrate PoC Runtime written in AssemblyScript

## Build AS WASM

1. Go to `runtime`
2. execute `npm run asbuild`
New `wasm-code` will be generated in the `sandbox` folder.

## Build the Sandbox
1. Go to `sandbox`
2. Execute `cargo build`

## Test out the AssemblyScript Runtime
1. Go to `sandbox`
2. Execute `cargo test`
3. To see the results of the called methods, execute `cargo test -- --nocapture`


# **License**
This repository is licensed under [Apache 2.0 license](https://github.com/LimeChain/as-substrate-runtime/blob/master/LICENSE)