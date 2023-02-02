FROM node:16 as builder
WORKDIR '/app'
COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]
RUN npm ci && npm cache clean --force
COPY src ./src
RUN npm run build

FROM node:16
WORKDIR '/app'
COPY ./package.json .

RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
CMD [ "npm", "run", "start" ]