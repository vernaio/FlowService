#!/bin/bash

version=dev-$(($(date +%s%N)/1000000))
timestamp=$(date +"%Y-%m-%d %T")

echo ""

if [[ -z $1 || $1 != "latest" ]]
then
    echo "Build Docker image..."

    # build docker file
    docker build \
        --no-cache \
        -t pib-flow:$version \
        -t pib-flow:latest \
        . 
else
    echo "Use latest Docker image..."
    version=latest

    # inspect image
    docker image inspect pib:$version
fi

# create files
mkdir -p ./data/in
mkdir -p ./data/out
mkdir -p ./data/storage

# execute
docker run \
    -p 1881:1881 \
    -v $PWD/../rindt-integration/:/opt/custom-integration \
    -v $PWD/lib/flow/src:/opt/flow/src \
    -v $PWD/data/in:/data/in \
    -v $PWD/data/out:/data/out \
    -v $PWD/data/storage:/data/storage \
    -e SPO_URL=spo-v3.web-apps.opti-beta.cloud \
    -e SPO_TENANT=rindt \
    -e SPO_USER=ppdev \
    -e SPO_PASSWORD=ppdev \
    -e SPO_WORKSPACE_ID=1a5d6832-2528-4947-9b3b-75c072f064c3 \
    -e INTEGRATION_NAME=rindt-integration \
    -e INTEGRATION_LOCATION=/opt/custom-integration \
    -e IMPOSITION_URL=http://127.0.0.1:4200 \
    -it \
    --entrypoint sh \
    pib-flow:$version

# clean up
rm -rf ./data
