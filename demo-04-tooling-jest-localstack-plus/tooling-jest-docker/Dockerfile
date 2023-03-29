FROM node:16-slim

USER node
WORKDIR /src

# Cache
COPY package.json yarn.lock /src/ 

RUN yarn

COPY . .

CMD npm start