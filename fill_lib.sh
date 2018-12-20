#!/bin/bash

pushd .

# fill up the libarary folder
cp -R ./dist/docs ./lib
cp -R ./base-client-js/dist/BitclaveBase.* ./lib

popd
