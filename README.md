
# Substrate Runtime in AssemblyScript

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![Unit Tests](https://github.com/LimeChain/as-substrate-runtime/workflows/Unit%20Tests/badge.svg)
![Integration Tests](https://github.com/LimeChain/as-substrate-runtime/workflows/Integration%20Tests/badge.svg)


Account-Based Substrate PoC Runtime written in AssemblyScript.

The project is funded by [Web3 Foundation](https://web3.foundation/) via their [General Grants Program](https://github.com/w3f/General-Grants-Program) 🙏
![WEB3 Badge](./web3_badge_black.png)

Currently the most matured way of developing Runtimes is using the Substrate framework (in Rust). The goal of this project is to deliver an Account-Based Substrate Runtime written in AssemblyScript as PoC.

This PoC can be considered the first step towards a general framework for developing runtimes in AssemblyScript.

## Roadmap

#### Milestone 1 - WASM API Mock :white_check_mark: 

In this milestone, the communication mechanism between the Host and Runtime will be established. The runtime will be able to access input passed from the Host and will be able to return data back to the Host as response. The Polkadot WASM API entries are mocked in this milestone.

#### Milestone 2 - Storage Module :white_check_mark:
In this milestone the basic functionality for setting and getting storage from the AS Runtime using the Polkadot HOST API will be implemented.

#### Milestone 3 - Support for Aura consensus :white_check_mark:
In this milestone the Aura Module functionality will be implemented into the AS Runtime.

#### Milestone 4 - State Transition function :white_check_mark:
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
└───runtime    <--- Runtime packages & source code
|
└───node-template <--- Substrate node with native runtime
│
└───sandbox    <--- Rust environment for testing the Runtime
│
└───end-to-end    <--- End-to-end tests of the Runtime
```

### Packaging

The runtime is divided into `packages` and `src`. The packages are different components that we find useful to reuse and the `src` is the top-level code that compiles the whole project into a `runtime`.
The hierarchy has the following structure:
```
Runtime
│
└───packages
│   └───core-modules       
│   └───core-utils         
│   └───models              
│   └───modules        <--- Modules packages. Contains the top-level "pallets" used in the Runtime
│       └───balances       
│       ....
│
└───src
``` 

All of the packagings are done using `yarn` workspaces. Thus so far we have the following `workspaces`:
- [`@core-modules`](https://github.com/LimeChain/as-substrate-runtime/tree/master/runtime/packages/core-modules) - The core-modules that are used by most of the modules (f.e Storage, Crypto etc.)
- [`@core-utils`](https://github.com/LimeChain/as-substrate-runtime/tree/master/runtime/packages/core-utils) - Package containing utility functions
- [`@models`](https://github.com/LimeChain/as-substrate-runtime/tree/master/runtime/packages/models) - Package containing model classes (block, header, extrinsic, etc...)
- [`@balances`](https://github.com/LimeChain/as-substrate-runtime/tree/master/runtime/packages/modules/balances) - Balances modules package. Responsible for the Balances functionality (setting/getting/changing balances of the accounts) 
- [`@runtime`](https://github.com/LimeChain/as-substrate-runtime/tree/master/runtime/src) - Top-level code that complies into the Runtime

## Tools

### Spec-builder
In the `runtime/tools` folder, there is a [`spec-builder`](https://github.com/LimeChain/as-substrate-runtime/tree/master/runtime/tools/spec-builder) tool that assists developers in generating `raw` versions of their genesis json files.

## Substrate Node

```
node-template
│
└───node
└───runtime
```

Substrate provides a template node that uses `Aura` consensus for block production and `Granpda` for block finalization. Since our AssemblyScript runtime currently does not support `Grandpa`, we have modified the Node-template to not use `Grandpa` at all.

Substrate Runtimes compile to both native executable and WASM binary, therefore we need native executable for initializing our Node. Then, we provide WASM binary generated from AssemblyScript Runtime with the `chainspec` file. After the intialization, with the correct execution flags, the Substrate should be able to upgrade from the native runtime to the WASM binary. To learn more about how Substrate Nodes execute the runtime, please refer to [this](https://substrate.dev/docs/en/knowledgebase/advanced/executor)

## Playing with the Runtime
The runtime has 3 types of tests so far -> Integration, Unit and End-to-End tests.
The Unit tests are written in AssemblyScript and are testing f.e the instantiation or encoding of a `Block` from a SCALE encoded Byte Array.

The Integration tests are written in Rust. They are calling into the WASM code and are validating:
1. Whether the WASM code exposes the required API functions.
2. Whether the API functions are returning the correct responses.

### 0. Prerequisite
- Have `rust` installed so that you can build and run the Integration tests

### 1. Build the Runtime
1. Go to `./runtime`
2. Execute `yarn install`
3. Execute `yarn run build`
New `wasm-code` binary file will be generated in the `runtime` folder.

### 2. Run the Unit Tests for Runtime
1. Go to `./runtime`
2. Execute `yarn run test`

### 3. Compile the Rust Environment (Sandbox)
1. Go to `./sandbox`
2. Execute `cargo build`
* The build might take a couple of minutes. 

### 4. Run the Integration Tests (Option 1)
0. Build the AS Runtime using the instructions above
1. Go to `./sandbox`
2. Execute `cargo test`

*To see the results of the called methods, execute the command with `cargo test -- --nocapture`

### 4. Run the Integration Tests (Option 2)
1. Go to `./sandbox`
2. Execute `bash run-it.sh`

### 5. Run the Unit Tests for Spec-Builder
1. Go to `./runtime/tools/spec-builder`
2. Build `wasm module` by executing `yarn run asbuild`
3. Execute `yarn run test`

### 6. Build and Run the node with WASM code
1. Copy `wasm-code` generated earlier in the `../runtime` directory
2. Go to `./node-template`
3. Paste the whole content of `wasm-code` with a prefix `0x`, as a value of `code` property in `customSpec.json`
4. Build WASM module and generate chain spec by executing:
```
yarn --cwd=../runtime build-spec -f ../node-template/customSpec.json -o ../node-template/customSpecRaw.json
```
5. Build the node `cargo build --release` (may take a while)
6. (Optional) Purge the existing db with the following command:
```
bash compile-purge.sh 
```
7. Run the node with the generated chain spec:  
```
./target/release/node-template \
    --chain=./customSpecRaw.json \
    --port 30333 \
    --ws-port 9944 \
    --rpc-port 9933 \
    --validator \
    --rpc-methods=Unsafe \
    --name Node01 \
    --base-path /tmp/node01 \
    --execution Wasm
```    
The Node should start, but no blocks will be produced. For activating block production see the Block Production section.

### 7. Run End-to-End tests 
End-to-end tests are designed to test the account transactions.

1. Execute `docker-compose up` which runs 4 instances of Substrate nodes
2. Go to `./e2e-tests`
3. Run `npm install` to load all dependencies
4. Run `npm test` 

## Running in Docker

You should have [Docker](https://docker.io) installed.

### Docker image from Docker hub (option 1)

We have a Docker Hub repository where we host the latest stable image of the executable file of the project. This is the easiest and fastest way to run the Substrate node with Assemblyscript Runtime.

First, pull the image from the Docker Hub. 
``` 
docker pull limechain/as-substrate:stable
```

Then run the executable:

```
docker run -p 9933:9933 -p 9944:9944 -p 30333:30333 --name node-runtime \
limechain/as-substrate:stable \
    --validator \
    --rpc-methods=Unsafe \
    --name Node01 \
    --base-path /tmp/node01 \
    --execution Wasm \
    --rpc-external
```

### Build the image (option 2)

1. Go to the root directory of the repo
2. Build the Docker image:

```
docker build -t substrate/runtime .
```
It might take a while for Rust to compile the project (~30-40 minutes). After you built the image, run the node:

```
docker run -p 9933:9933 -p 9944:9944 -p 30333:30333 --name node-runtime substrate/runtime \
    --validator \
    --rpc-methods=Unsafe \
    --name Node01 \
    --base-path /tmp/node01 \
    --execution Wasm \
    --rpc-external
```
And the node should start running and attempting to produce blocks. However, we first need to insert our keys for node to start actually producing blocks. Note that `rpc-external` option is required for accessing the node with RPC calls.

## Block production

We already have generated Aura keys for testing purposes, which is also passed to the node with `chain spec` file. Run this to add the keys to the node with `author_insertKey` RPC call:
```
curl --location --request POST 'localhost:9933' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_insertKey",
    "params": ["aura","stool celery junk extend panther shock pact sorry violin spring degree odor","0x82b3f9330690e5a74aa9806d71298e68a03d80e773332f615e3bdd64ee71f050"],
    "id": 1
}'
```
The response should be:

```
{"jsonrpc":"2.0","result":null,"id":1}
```

Now, node will start producing blocks.

## Test Runtime modules with RPC calls

We have created a Postman collection with some useful RPC calls that access the Runtime API entries.

Follow this [link](https://documenter.getpostman.com/view/12337614/T1LSC6Qb?version=latest) to play around with the Postman collection. You need to have the a Substrate node running with the `chain spec` generated by our runtime and `rpc-external` option enabled if you are running with Docker.

## Run a network of 4 nodes

You can run a network of 4 nodes using the stable images published in the LimeChain DocerHub repository.
In order to do that, execute the following command:

`docker-compose up`

Keep in mind that you still have to import the Aura keys into the validtor nodes in order for them to start producing blocks. You can do that by performing the following requests:
Validator 1:

```
curl --location --request POST 'localhost:5000' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_insertKey",
    "params": ["aura","dice height enter anger ahead chronic easily wave curious banana era happy","0xdcc1461cba689c60dcae053ef09bc9e9524cdceb696ce39c7ed43bf3a5fa9659"],
    "id": 1
}'
```

Validator 2:
```
curl --location --request POST 'localhost:5001' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_insertKey",
    "params": ["aura","spray later man depth auction tape autumn rocket bullet grunt adult flight","0x203d05ced7e80c58db6ca60ceb28041dc28be0066ce9b1d75fd92597adae124f"],
    "id": 1
}'
```


# **License**
This repository is licensed under [Apache 2.0 license](https://github.com/LimeChain/as-substrate-runtime/blob/master/LICENSE)
