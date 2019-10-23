#!/bin/bash
set -e

echo -n "SPO Password:" 
read -s password

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
    -v $PWD/lib/flow/src:/opt/flow/src \
    -v $PWD/data/in:/data/in \
    -v $PWD/data/out:/data/out \
    -v $PWD/data/storage:/data/storage \
    -e SPO_URL=spo-v3.web-apps.wmdTest.tryout.zone \
    -e SPO_TENANT=pib \
    -e SPO_USER=vorstufe \
    -e SPO_PASSWORD=$password \
    -e SPO_WORKSPACE_ID=test \
    -e INPUT_LOGIC_NAME=default-flow-logic \
    -e INPUT_LOGIC_URL=https://github.com/perfectpattern/DefaultFlowLogic/archive/0.5.tar.gz \
    -e IMPOSITION_URL=http://192.168.0.233:4200 \
    -it \
    --entrypoint sh \
    pib-flow:$version

# clean up
rm -rf ./data
