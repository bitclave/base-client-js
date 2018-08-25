# Introduction

This folder is the root of automatically generated documentation for all SW components of base-client-js library.

To help you with developing APPs on top of BASE APIs, please visit the following examples

- [BASE Platform Tutorial](https://github.com/bitclave/base-tutorial) <br/>
This is the most basic example demonstrating the usage of the most basic BASE APIs

- [Base Application Starter - AngularJS](https://github.com/bitclave/base-tutorial-sample-app) <br/>
This is a more advanced example showing a sample application with UI that us using BASE APIs

- [BASE low level base-client-js example](https://github.com/bitclave/base-client-js/tree/develop/example) <br/>
This is a sample application demonstrating the use of all base-client-js APIs

- [BASE Auth Frontend](https://github.com/bitclave/base-auth-frontend) <br/>
This is a widget that can be used for registration and authorization into BASE ecosystem



# BASE-CLIENT-JS
JS client side library for interaction with BASE platform.

[![Build Status](https://travis-ci.org/bitclave/base-client-js.svg?branch=develop)](https://travis-ci.org/bitclave/base-client-js)
[![Coverage Status](https://coveralls.io/repos/github/bitclave/base-client-js/badge.svg)](https://coveralls.io/github/bitclave/base-client-js)

This repository contains code for BASE-CLIENT-JS library. This library can be integrated by our partners to interact with BASE platform from client side. The library does not store any keys.

The repository also includes an example application, demonstrating how to integrate the library in WEB application

# Overview

![Alt text](https://github.com/bitclave/base-client-js/blob/develop/images/base_phase1_overview.png)

# How to build
- from root directory run
```
./install_lib.sh

```
# How to run example application
- from example directory run
```
npm start
```

# How to run tests
- from root directory run
```
node ./external/Signer.js --authPK 02e2d9c04891bf7f9934041d7171ade343e540f5d18bd357cde4ef175da3de7e06 --host https://base2-bitclva-com.herokuapp.com &
npm test
```
