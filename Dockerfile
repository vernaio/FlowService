### BUILD IMAGE ###
FROM node:12-stretch AS builder

RUN mkdir -p /work/flow && chown node:node /work/flow

COPY --chown=node:node ["lib", "/work/flow/lib"]
COPY --chown=node:node ["README.md", "/work/flow/"]

WORKDIR /work/flow

USER node

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
ENV INTEGRATION_NAME=default-flow-logic
ENV INTEGRATION_LOCATION=https://github.com/perfectpattern/DefaultPdfIntegration/archive/1.0.2.tar.gz
ENV IMPOSITION_URL=http://imposition:4200

# create folder interface
RUN mkdir -p /opt/flow \
    && mkdir -p /data/in \
    && mkdir /data/out \
    && mkdir /data/storage

# copy files
COPY --from=builder /work/flow/lib/flow /opt/flow

# change working directory
WORKDIR /opt/flow

# status check
HEALTHCHECK  --interval=10s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:1881/status || exit 1

# define container entry point
ENTRYPOINT [ "npm", "start" ]

