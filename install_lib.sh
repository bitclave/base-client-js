#!/bin/bash

pushd .
npm install       #postinstall: node remove-bitcore-lib-dep.js
npm run preBuild  #tsc --outDir dist -d
npm run build     # webpack

cp ./dist/Bitclave-Base.js* example/public/base-lib/bitclave-base
cp -R ./dist/lib/* example/public/base-lib/@types/bitclave-base
mv ./example/public/base-lib/@types/bitclave-base/Base.d.ts ./example/public/base-lib/@types/bitclave-base/index.d.ts

# fill libarary folder
cp -R ./dist/docs ./lib

popd
