FROM node:12-alpine
WORKDIR /usr/src/app

ADD package.json ./
ADD tsconfig.json ./
COPY src ./src

RUN yarn; yarn build

ENV NODE_ENV production
ENV PORT 8080
EXPOSE 8080

CMD [ "yarn", "start" ]