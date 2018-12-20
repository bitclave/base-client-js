#!/bin/bash

pushd .
# cleanup lib folder
rm -rf ./lib/*
rm -rf dist
rm -rf example/public

npm install       #postinstall: node remove-bitcore-lib-dep.js
npm run preBuild  #tsc --outDir dist -d
npm run build     # webpack

mkdir -p example/public/base-lib/bitclave-base
mkdir -p example/public/base-lib/@types/bitclave-base


cp ./dist/Bitclave-Base.js* example/public/base-lib/bitclave-base
cp -R ./dist/lib/* example/public/base-lib/@types/bitclave-base
mv ./example/public/base-lib/@types/bitclave-base/Base.d.ts ./example/public/base-lib/@types/bitclave-base/index.d.ts
cp example/package.json example/public/base-lib/bitclave-base/

cd base-client-js-bundle && make build && cd ..

cp -R ./dist/docs ./lib
cp -R ./base-client-js-bundle/dist/BitclaveBase.* ./lib

rm -rf example/public

echo base-client-js is ready for publishing

popd
