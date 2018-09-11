# BASE-CLIENT-JS
JS client side library for interaction with BASE platform.

[![Build Status](https://travis-ci.org/bitclave/base-client-js.svg?branch=develop)](https://travis-ci.org/bitclave/base-client-js)
[![Coverage Status](https://coveralls.io/repos/github/bitclave/base-client-js/badge.svg)](https://coveralls.io/github/bitclave/base-client-js)

This repository contains code for BASE-CLIENT-JS library. This library can be integrated by our partners to interact with BASE platform from client side. The library does not store any keys.

The repository also includes an example application, demonstrating how to integrate the library in WEB application

# Overview

![Alt text](https://github.com/bitclave/base-client-js/blob/develop/images/base_phase1_overview.png)

# How to run
- from root directory run
```
npm install
node ./external/Signer.js

```
- from example directory run
```
npm install
cp -rf public/base-lib/* node_modules/
npm start
```
# about tests
- the prerequest for extValidator test running is
```
node ./external/Signer.js --authPK 02e2d9c04891bf7f9934041d7171ade343e540f5d18bd357cde4ef175da3de7e06 --host https://base2-bitclva-com.herokuapp.com
```
(Signer will run on port 3545)
