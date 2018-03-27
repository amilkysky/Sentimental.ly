# Sentimental.ly

A full-stack business analytics application that connects to Twitter's Streaming API. The application renders live-updating line chart displaying tweet sentiment data.

## An Application By

Daphne Dang

## Technologies:

Node.js
Express
PostgreSQL
Redis
React
Redux
Redux-Thunk
D3
Jest
Enzyme
Mocha
Chai
Chai-HTTP

# Deployed Application

Visit www.herokuapp.com/

# Local Installation

## Usage

> Some usage instructions

## Requirements

- Node 6.9.x
- Redis 3.2.x
- Postgresql 9.6.x
- etc

### Installing System Dependencies

```
brew install yarn
brew install redis
brew install postgresql
```

Yarn is a replacement for npm. It's faster and *guarantees* consistency -- as you deploy your code in various environments, you won't run the risk of slight variations in what gets installed.

### Install Project Dependencies

```
yarn global add grunt-cli knex eslint
```

## App Configuration

Override settings `config/default.json` in any environment by making a copy of `config/ENV.example.json` and naming it `config/ENV.json` and setting the appropriate variable.

For environments that require use of environment variables, you can supply variables as defined in `config/custom-environment-variables.json`.

## Running the App

To run webpack build: `yarn run build`

To run server: `yarn run start`

To run tests: `yarn run test`

To run your redis server for the session store `redis-server`


