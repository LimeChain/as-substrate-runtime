# Building node and running it with the customSpecRaw.json
FROM paritytech/ci-linux:production AS node-builder

WORKDIR /usr/src/node

COPY ./node-template ./

RUN cargo build --release

# Run the node with the passed customSpecRaw.json argument

FROM ubuntu:18.04
WORKDIR /usr/src/app
COPY --from=node-builder /usr/src/node/target/release/node-template ./node-template
EXPOSE 9933 9944/tcp 30333
ENTRYPOINT ["./node-template", "--rpc-methods=Unsafe", "--rpc-cors=all", "--rpc-external", "--execution", "Wasm", "--rpc-port", "9933", "--ws-port", "9944", "--port", "30333", "--name", "Node01", "--base-path", "/tmp/node01", "--validator", "--offchain-worker", "Never", "--chain"]