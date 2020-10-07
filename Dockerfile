# Building runtime and generating customSpecRaw.json

FROM node:14.8 AS builder

WORKDIR /usr/src/

COPY ./runtime ./runtime
COPY ./node-template/cr-custom-spec.sh ./runtime/tools/spec-builder/cr-custom-spec.sh
COPY ./node-template/customSpec.json ./runtime/tools/spec-builder/customSpec.json

WORKDIR /usr/src/runtime

RUN yarn install && yarn run build && mv wasm-code ./tools/spec-builder

WORKDIR /usr/src/runtime/tools/spec-builder

RUN apt-get update -y && apt-get install jq -y
RUN yarn run asbuild && bash cr-custom-spec.sh && yarn build-spec -f customSpec.json

# Building node and running it with the customSpecRaw.json

FROM rust:1.45 AS node-builder

WORKDIR /usr/src/node

COPY ./node-template ./

COPY --from=builder /usr/src/runtime/tools/spec-builder/customSpecRaw.json ./

RUN bash ./scripts/init.sh
RUN apt-get update -y &&\
    apt-get -y install clang gcc cmake

RUN cargo build --release

FROM ubuntu:18.04
WORKDIR /usr/src/app
COPY --from=node-builder /usr/src/node/target/release/node-template ./node-template
COPY --from=node-builder /usr/src/node/customSpecRaw.json ./customSpecRaw.json
EXPOSE 9933 9944 30333
ENTRYPOINT ["./node-template", "--chain=./customSpecRaw.json", "--rpc-methods=Unsafe", "--rpc-external", "--execution", "Wasm", "--rpc-port", "9933", "--ws-port", "9944", "--port", "30333", "--name", "Node01", "--base-path", "/tmp/node01", "--validator"]