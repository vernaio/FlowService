@echo off
SET version=DEV
SET /P password=Password: 

docker build ^
    --no-cache ^
    -t pib-flow:%version% ^
    .

mkdir data\in
mkdir data\storage
mkdir data\out

docker run ^
    -p 1881:1881 ^
    -v %cd%/lib/flow/src:/opt/flow/src ^
    -v %cd%/data/in:/data/in ^
    -v %cd%/data/out:/data/out ^
    -v %cd%/data/storage:/data/storage ^
	-v C:\dev\pib-flows\rindt-integration:/opt/custom-integration ^
    -e SPO_URL=spo-v3.web-apps.opti-beta.cloud ^
    -e SPO_TENANT=spodemo ^
    -e SPO_USER=admin ^
    -e SPO_PASSWORD=%password% ^
    -e SPO_WORKSPACE_ID=pib-demo-1 ^
    -e INTEGRATION_NAME=rindt-integration ^
    -e INTEGRATION_LOCATION=/opt/custom-integration ^
    -e IMPOSITION_URL=http://192.168.0.224:4200 ^
    -it ^
    --entrypoint sh ^
    pib-flow:%version%