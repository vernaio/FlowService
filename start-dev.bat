@echo off
SET version=DEV
SET /P password=Password: 

docker build ^
    --no-cache ^
    -t pib-flow:%version% ^
    .

mkdir data/in
mkdir data/storage
mkdir data/out

docker run ^
    -p 1881:1881 ^
    -v %cd%/lib/flow/src:/opt/flow/src ^
    -v %cd%/data/in:/data/in ^
    -v %cd%/data/out:/data/out ^
    -v %cd%/data/storage:/data/storage ^
    -e SPO_URL=spo-v3.web-apps.wmdTest.tryout.zone ^
    -e SPO_TENANT=pib ^
    -e SPO_USER=vorstufe ^
    -e SPO_PASSWORD=%password% ^
    -e SPO_WORKSPACE_ID=test ^
    -e INPUT_LOGIC_NAME=default-pdf-integration ^
    -e INPUT_LOGIC_URL=https://github.com/perfectpattern/DefaultPdfIntegration/archive/1.0.0.tar.gz ^
    -e IMPOSITION_URL=http://192.168.0.224:4200 ^
    -it ^
    --entrypoint sh ^
    pib-flow:%version%