FROM node:14.8

COPY ./ ./

WORKDIR /runtime

RUN yarn install

CMD ["yarn", "run", "build"]

