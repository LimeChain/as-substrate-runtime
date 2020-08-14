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
RUN yarn build-spec -f customSpec.json && cat customSpecRaw.json
#CMD ["yarn", "build-spec", "-f", "customSpec.json"]

