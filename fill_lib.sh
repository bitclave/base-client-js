#!/bin/bash

pushd .

cp -R ./base-client-js/dist/@types ./lib/
cp ./base-client-js/dist/BitclaveBase.js ./lib/

popd
