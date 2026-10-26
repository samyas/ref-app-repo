# ---- Build stage: needs npm to install the production dependencies ----
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

# ---- Runtime stage: only what is needed to run "node server.js" ----
FROM node:24-alpine
WORKDIR /app

# npm and yarn are package managers, not needed to run the app. Removing them
# drops the packages they bundle (tar, etc.) from the image: fewer CVEs to
# patch and less for an attacker to use if the container is ever compromised.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
           /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg

COPY --from=build --chown=node:node /app /app
USER node
EXPOSE 3000
CMD ["node", "server.js"]