[![Build Status](https://travis-ci.org/secret-squirrel/ssq-node-client.svg?branch=develop)](https://travis-ci.org/secret-squirrel/ssq-node-client)

```
         _.-"""-,
       .'  ..::. `\
      /  .::' `'` /
     / .::' .--.=;
     | ::' /  C ..\
     | :: |   \  _.)
      \ ':|   /  \
       '-, \./ \)\)
          `-|   );/
             '--'-'
```

# Secret Squirrel Client

## Introduction

This project is meant to be both a reusable client implementation (via npm ssq-client) and a feature-complete command-line interface.

It also serves as a reference implementation for future Secret Squirrel clients. See the [server wiki](https://github.com/twg/secretsquirrel-server/wiki) for an architecture overview.

Make sure to checkout the [server](https://github.com/twg/secretsquirrel-server) and [desktop](https://github.com/twg/secretsquirrel-desktop) clients.

## Getting Started

```
git clone git@github.com:twg/secretsquirrel-cli.git && cd secretsquirrel-cli
npm install
node squirrel.js
```

Get the [server](https://github.com/twg/secretsquirrel-server) up and running.

So far you can generate a new keypair:

`node squirrel.js keypair-create`

And create a user:

`node squirrel.js user-create --firstName Matt --lastName MacAulay --email mac@twg.ca`


## Tests

To run the test suite:

`npm test`

Or install mocha globally

```
npm install -g mocha
mocha
```
