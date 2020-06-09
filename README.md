# Node-trade-wallet

A back-end to serve a financial service using a third party api by Finhub.

---

## Requirements

- For development, you will only need Node.js, Yarn, MongoDb and a API Token to access Finhub financial api, installed in your environement.

### Node

- You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

### Mongo

- You can find more information about the installation on the [official MongoDB website](https://www.mongodb.com/) .

###

### Yarn

- You can find more information about the installation on the [official Yarn website](https://yarnpkg.com/).

### Finhub

- You can find more information about how to retrieve your token on the [official finhub website](https://finnhub.io/).

---

## Install

    $ git clone https://github.com/Thiago-AS/node-trade-wallet.git
    $ cd node-trade-wallet
    $ yarn

## Configure app

- Set you finhub token as a environment variable:

```
FINHUB_TOKEN=YOUR_TOKEN
```

- You can change both the server port as the database using the following environment variables:

```
MONGODB_URI=DB_URI
PORT=SERVER_PORT
```

## Running the project

- To run in development environment with hot reload use:

```
$ yarn run dev
```

- To run in development environment use:

```
$ yarn run prod
```
