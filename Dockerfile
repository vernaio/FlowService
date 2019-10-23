### BUILD IMAGE ###
FROM node:12-stretch AS builder

RUN mkdir -p /work/flow && chown node:node /work/flow

COPY --chown=node:node [".git", "/work/flow/.git"]
COPY --chown=node:node ["lib", "/work/flow/lib"]
COPY --chown=node:node [".gitignore", "Dockerfile", "README.md", "start-dev.sh", "version.sh", "/work/flow/"]

WORKDIR /work/flow

USER node

RUN sh version.sh \
    && rm -rf .git \
    && rm version.sh

RUN cd lib/flow && npm install --build-from-source


### PRODUCTIVE IMAGE ###
FROM node:12-alpine

# implementation specific environment variables
ENV SPO_URL=undefined
ENV SPO_TENANT=undefined
ENV SPO_USER=undefined
ENV SPO_PASSWORD=undefined
ENV SPO_WORKSPACE_ID=undefined

# settings
ENV INPUT_LOGIC_NAME=default-flow-logic
ENV INPUT_LOGIC_URL=https://github.com/perfectpattern/DefaultFlowLogic/archive/0.5.tar.gz
ENV IMPOSITION_URL=http://imposition:4200

# create folder interface
RUN mkdir -p /opt/flow && chown node:node /opt/flow \
    && mkdir -p /data/in && chown node:node /data/in \
    && mkdir -p /data/out && chown node:node /data/out \
    && mkdir -p /data/storage && chown node:node /data/storage

# copy files
COPY --chown=node:node --from=builder /work/flow/lib/flow /opt/flow
COPY --chown=node:node --from=builder /work/flow/version.properties /opt/flow/version.properties

# change working directory
WORKDIR /opt/flow

# change user
USER node

# status check
HEALTHCHECK  --interval=10s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:1881/status || exit 1

# define container entry point
ENTRYPOINT [ "npm", "start" ]

