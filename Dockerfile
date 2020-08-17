# Building runtime and generating customSpecRaw.json

FROM node:14.8 AS builder

COPY ./ ./
COPY ./cr-custom-spec.sh ./runtime/tools/spec-builder/cr-custom-spec.sh
COPY ./customSpec.json ./runtime/tools/spec-builder/customSpec.json

WORKDIR /runtime

RUN yarn install

RUN yarn run build

RUN mv wasm-code ./tools/spec-builder

WORKDIR /runtime/tools/spec-builder

RUN apt-get update -y 
RUN apt-get install jq -y
RUN yarn run asbuild && bash cr-custom-spec.sh
RUN yarn build-spec -f customSpec.json
CMD ["pwd"]

# Building node and running it with the customSpecRaw.json

FROM rust:1.45 AS node-builder

WORKDIR /usr/src/dummy

COPY ./node-template ./

RUN bash ./scripts/init.sh
RUN apt-get update -y 
RUN apt-get -y install clang
RUN apt-get -y install gcc
RUN apt-get -y install cmake

RUN cargo build --release

COPY --from=builder ./runtime/tools/spec-builder/customSpecRaw.json ./

CMD ["./target/release/node-template\
  --base-path /tmp/node01 \
  --chain=./customSpecRaw.json \
  --port 30333 \
  --ws-port 9944 \
  --rpc-port 9933 \
  --telemetry-url 'ws://telemetry.polkadot.io:1024 0' \
  --validator \
  --rpc-methods=Unsafe \
  --name MyNode01"]