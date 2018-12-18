#!/bin/bash

pushd .
npm install
# node remove-bitcore-lib-dep.js
npm run preBuild
npm run build

cp ./dist/Bitclave-Base.js* example/public/base-lib/bitclave-base/
cp -rf ./dist/src/* example/public/base-lib/@types/bitclave-base/
mv ./example/public/base-lib/@types/bitclave-base/Base.d.ts ./example/public/base-lib/@types/bitclave-base/index.d.ts

popd
