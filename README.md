# BASE-CLIENT-JS
JS client side library for interaction with BASE platform.

[![Build Status](https://travis-ci.org/bitclave/base-client-js.svg?branch=develop)](https://travis-ci.org/bitclave/base-client-js)
[![Coverage Status](https://coveralls.io/repos/github/bitclave/base-client-js/badge.svg)](https://coveralls.io/github/bitclave/base-client-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository contains code for BASE-CLIENT-JS library. This library can be integrated by our partners to interact with BASE platform from client side. The library does not store any keys.

The repository also includes an example application, demonstrating how to integrate the library in WEB application

## Overview

![Alt text](https://github.com/bitclave/base-client-js/blob/develop/images/base_phase1_overview.png)

## How to build
- from root directory run
```
./install_lib.sh

```
## How to run example application
- from example directory run
```
npm start
```

## How to run tests
- from root directory run
```
node ./external/Signer.js --authPK 02e2d9c04891bf7f9934041d7171ade343e540f5d18bd357cde4ef175da3de7e06 --host https://base2-bitclva-com.herokuapp.com &
npm test
```

## How to profile tests

- from root directory run

```shell
$ npm run profile -- "Alice grants access to validator" (specify the test(`it`) that you want to profile in quotes)

> @bitclave/base-client-js@0.1.2 profile /Users/sai/workspace/base-client-js
> 0x -o -- node $(which _mocha) --exit --timeout 100000 --recursive --require ts-node/register "./test/**/*Test.ts" -g "Alice grants access to validator"

🔥  Profiling

  BASE API test: External Validator
    ✓ Alice grants access to validator (2986ms)


  1 passing (17s)

🔥  Flamegraph generated in
file:///path/to/generated/profile/flamegraph.html

```

- flamegraph should be automatically opened in your default browser (or else open the generated file shown above)
