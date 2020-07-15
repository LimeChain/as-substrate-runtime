
# Substrate Runtime in AssemblyScript (WIP)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![Unit Tests](https://github.com/LimeChain/as-substrate-runtime/workflows/Unit%20Tests/badge.svg)
![Integration Tests](https://github.com/LimeChain/as-substrate-runtime/workflows/Integration%20Tests/badge.svg)


Account-Based Substrate PoC Runtime written in AssemblyScript.

The project is funded by [Web3 Foundation](https://web3.foundation/) via their [General Grants Program](https://github.com/w3f/General-Grants-Program) 🙏

Currently the most matured way of developing Runtimes is using the Substrate framework (in Rust). The goal of this project is to deliver an Account-Based Substrate Runtime written in AssemblyScript as PoC.

This PoC can be considered the first step towards a general framework for developing runtimes in AssemblyScript.

## Roadmap

#### Milestone 1 - WASM API Mock :white_check_mark: 

In this milestone, the communication mechanism between the Host and Runtime will be established. The runtime will be able to access input passed from the Host and will be able to return data back to the Host as response. The Polkadot WASM API entries are mocked in this milestone.

#### Milestone 2 - Storage Module
In this milestone the basic functionality for setting and getting storage from the AS Runtime using the Polkadot HOST API will be implemented.

#### Milestone 3 - Support for Aura consensus
In this milestone the Aura Module functionality will be implemented into the AS Runtime.

#### Milestone 4 - State Transition function
In this milestone the State transition function will be implemented into the AS Runtime. As part of the State transition function the previously mocked WASM API functions will be implemented as-well. At this point the runtime must be able to:
1.  Define genesis state and account balances
2.  Run its Aura consensus.
3.  Sync/Initialize/Execute blocks.
4.  Being able to process Account Balance transfers (Extrinsics)

## Project Structure
The most important components of this project are the following:
```
as-substrate-runtime
│
└───runtime
│   └───assembly
│       └─── __tests__     <--- Runtime unit tests
│       └─── api           <--- WASM API (Core, BlockBuilder, etc..)
│       └─── models        <--- Runtime model classes (block, header, extrinsic, etc...)
│  
└───sandbox                <--- Rust environment for testing the Runtime
```

## Playing with the Runtime
The runtime has 2 types of tests so far -> Integration and Unit tests
The Unit tests are written in AssemblyScript and are testing f.e the instanciation or encoding of a `Block` from a SCALE encoded Byte Array.

The Integration tests are written in Rust. They are calling into the WASM code and are validating:
1. Whether the WASM code exposes the required API functions.
2. Whether the API functions are returning the correct responses.

### Building the Runtime
1. Go to `./runtime`
2. Execute `npm run install`
3. Execute `npm run asbuild`
New `wasm-code` binary file will be generated in the `../sandbox` folder.

### Running the Unit Tests
1. Go to `./runtime`
2. Execute `npm run test`

### Compile the Rust test Environment (Sandbox)
1. Go to `./sandbox`
2. Execute `cargo build`

### Run the Integration Tests
1. Go to `./sandbox`
2. Execute `cargo test`
*To see the results of the called methods, execute the commant with `cargo test -- --nocapture`

# **License**
This repository is licensed under [Apache 2.0 license](https://github.com/LimeChain/as-substrate-runtime/blob/master/LICENSE)