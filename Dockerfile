FROM node:14.16.1-slim as builder
COPY ["package.json", "package-lock.json*", "rollup.config.js", "./"]
RUN npm install
COPY src ./src/
COPY static ./static/
COPY scripts ./scripts/
RUN npm run build

FROM node:14.16.1-slim
WORKDIR /protown
COPY ["package.json", "package-lock.json*", "rollup.config.js", "./"]
RUN npm install --production
COPY src ./src/
COPY static ./static/
COPY scripts ./scripts/
COPY --from=builder __sapper__ ./__sapper__/
USER 1000
CMD ["npm", "run", "start"] 