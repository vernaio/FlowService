@echo off
SET version=latest

mkdir data/in
mkdir data/storage
mkdir data/out

docker run ^
    -p 1881:1881 ^
    -v %cd%/lib/flow/src:/opt/flow/src ^
    -v %cd%/data/in:/data/in ^
    -v %cd%/data/out:/data/out ^
    -v %cd%/data/storage:/data/storage ^
    -e SPO_TENANT=testpib ^
    -e SPO_USER=box ^
    -e SPO_PASSWORD=NbB08Cv67EFa1p9m4JY2irWJAr3R6v ^
    -e SPO_WORKSPACE_ID=box ^
    -e IMPOSITION_URL=http://127.0.0.1:4200 ^
    -it ^
    --entrypoint sh ^
    perfectpattern/flow-service
