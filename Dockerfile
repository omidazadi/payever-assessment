FROM node:18.12.0-alpine3.16 as build

WORKDIR	/app

COPY . .

RUN npm install
RUN npm run build

FROM node:18.12.0-alpine3.16 As production

WORKDIR /app

COPY package.json .
COPY --from=build --chown=node:node /app/dist ./dist

RUN npm install --omit=dev

CMD ["node", "dist/main"]
