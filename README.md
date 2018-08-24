# BASE-CLIENT-JS

Javascript client side library for interaction with BASE platform

## Overview

- This library can be integrated by our partners to interact with BASE platform
- The library does not store any keys
- Repo includes an example application to demo how to integrate the library in a web app
- [![Build Status](https://travis-ci.org/bitclave/base-client-js.svg?branch=develop)](https://travis-ci.org/bitclave/base-client-js)
- [![Coverage Status](https://coveralls.io/repos/github/bitclave/base-client-js/badge.svg)](https://coveralls.io/github/bitclave/base-client-js)
- [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
- [!Alt text](https://github.com/bitclave/base-client-js/blob/develop/images/base_phase1_overview.png)

# How to build
- from root directory run
```
./install_lib.sh
```
# How to run example application
- Change to `example` directory then run ```npm start```

# How to run tests
- from root directory run
```
node ./external/Signer.js --authPK 02e2d9c04891bf7f9934041d7171ade343e540f5d18bd357cde4ef175da3de7e06 --host https://base2-bitclva-com.herokuapp.com && npm test
```
