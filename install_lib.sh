#/bin/bash
pushd .
npm install
npm run build
cp ./dist/Base.js* example/public/base-lib/base/
cp ./dist/Base.js* ./widget
cp -rf ./dist/src/* example/public/base-lib/@types/base/
cd example/
npm install
cp -rf public/base-lib/* node_modules/
npm run build
popd
