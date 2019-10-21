FROM node:12-stretch AS builder

# create folders
RUN mkdir -p /opt/flow && chown node:node /opt/flow

# copy files
COPY --chown=node:node ["lib/flow/package.json", "/opt/flow/"]
COPY --chown=node:node ["lib/flow/src", "/opt/flow/src/"]

# change working directory
WORKDIR /opt/flow

# change user
USER node

# install pib 
RUN npm install --build-from-source


# FROM node:12.8.1-stretch-slim
FROM node:12-alpine

# build params
ARG BUILD_VERSION=DEVELOPMENT
ARG BUILD_TIMESTAMP=UNKNOWN
ARG BUILD_REVISION=UNKNWON
ENV BUILD_VERSION=${BUILD_VERSION}
ENV BUILD_TIMESTAMP=${BUILD_TIMESTAMP}
ENV BUILD_REVISION=${BUILD_REVISION}

# implementation specific environment variables
ENV SPO_URL=undefined
ENV SPO_TENANT=undefined
ENV SPO_USER=undefined
ENV SPO_PASSWORD=undefined
ENV SPO_WORKSPACE_ID=undefined

# settings
ENV INPUT_LOGIC_NAME=undefined
ENV INPUT_LOGIC_URL=undefined
ENV IMPOSITION_URL=http://imposition:4200

# create folders
RUN mkdir -p /opt/flow && chown node:node /opt/flow \
    && mkdir -p /data/in && chown node:node /data/in \
    && mkdir -p /data/out && chown node:node /data/out \
    && mkdir -p /data/storage && chown node:node /data/storage

# copy files
COPY --chown=node:node --from=builder /opt/flow /opt/flow

# change working directory
WORKDIR /opt/flow

# change user
USER node

# status check
HEALTHCHECK  --interval=10s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:1881/status || exit 1

# define container entry point
ENTRYPOINT [ "npm", "start" ]

