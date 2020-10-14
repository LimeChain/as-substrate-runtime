# Pull node binary from the hub
FROM limechain/as-substrate-node:stable
WORKDIR /usr/src/app
EXPOSE 9933 9944/tcp 30333
ENTRYPOINT ["./node-template", "--rpc-methods=Unsafe", "--rpc-cors=all", "--rpc-external", "--execution", "Wasm", "--rpc-port", "9933", "--ws-port", "9944", "--port", "30333", "--name", "Node01", "--base-path", "/tmp/node01", "--validator", "--offchain-worker", "Never", "--chain=/customSpecRaw.json"]