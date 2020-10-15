# Build image of the modified Substrate Node
FROM paritytech/ci-linux:production

WORKDIR /usr/src/node

COPY ./ ./

RUN cargo build --release

WORKDIR /usr/src/node/target/release

EXPOSE 9933 9944/tcp 30333

ENTRYPOINT ["./node-template", "--rpc-methods=Unsafe", "--rpc-cors=all", "--rpc-external", "--execution", "Wasm", "--rpc-port", "9933", "--ws-port", "9944", "--port", "30333", "--name", "Node01", "--base-path", "/tmp/node01", "--validator", "--offchain-worker", "Never", "--chain=/customSpecRaw.json"]