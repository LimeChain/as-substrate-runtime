# Building node and running it with the customSpecRaw.json
FROM paritytech/ci-linux:production AS node-builder

WORKDIR /usr/src/node

COPY ./node-template ./

RUN cargo build --release

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


FROM ubuntu:18.04
WORKDIR /usr/src/app
COPY --from=node-builder /usr/src/node/target/release/node-template ./node-template
COPY --from=builder /usr/src/runtime/tools/spec-builder/customSpecRaw.json ./

EXPOSE 9933 9944/tcp 30333
ENTRYPOINT ["./node-template", "--chain=./customSpecRaw.json", "--rpc-methods=Unsafe", "--rpc-cors=all", "--rpc-external", "--execution", "Wasm", "--rpc-port", "9933", "--ws-port", "9944", "--port", "30333", "--name", "Node01", "--base-path", "/tmp/node01", "--validator"]