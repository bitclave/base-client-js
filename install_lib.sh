#!/bin/bash

pushd .
npm install
# node remove-bitcore-lib-dep.js
npm run preBuild
npm run build

#cp ./dist/Base.js* example/public/base-lib/base/
#cp ./dist/Base.js* ./widget
#cp -rf ./dist/src/* example/public/base-lib/@types/base/

cp ./dist/Bitclave-Base.js* example/public/base-lib/bitclave-base/
#cp ./dist/Bitclave-Base.js* ./widget
cp -rf ./dist/src/* example/public/base-lib/@types/bitclave-base/
mv ./example/public/base-lib/@types/bitclave-base/Base.d.ts ./example/public/base-lib/@types/bitclave-base/index.d.ts
cd example/
npm install

cp -rf public/base-lib/* node_modules/
npm run build
node ../remove-bitcore-lib-dep.js
popd
