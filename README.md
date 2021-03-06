<div align="center">
    <img src="images/license-MIT-blue.svg">
</div>

# Intro
Very simple application server framework for stateless services.

**Weak sides**: No support for stateful API.

**Strong sides**: Very simple, built on top express, well unit-tested.

---


# Quick start

### Install mocha test framework
```
npm install -g mocha
```

### Install Postgresql
Some tests are using Postgres, therefor it shall be setup and run.
```
git clone https://github.com/donDonald/dev-factory-postgres12.git
cd dev-factory-postgres12
docker-compose up -d
```
### Run unit-test
```
cd yeap_app_server
npm install
npm test
```

# Clone and run [example server](https://github.com/donDonald/yeap_app_server_example)
```
git clone https://github.com/donDonald/yeap_app_server_example.git
cd yeap_app_server-example
npm install
npm start
```
Navigate to [main](http://localhost:3000) page and look around.


## Features
- Built on top of [express](https://expressjs.com/) web framework, therefor supports all express features.
- Simple API routing, just create endpoint files(handler, RBAC rules and validator rules)
- Support for HTTP and HTTPS protocols
- Built-in role-based access control (RBAC)
- Built-in data structures validation
- Database access layer for PostgreSQL
- Logging facility
- Well unit-tested using mocha test framework

## Requirements

- Node.js (tested with v10.18.1 and v14.16.1)
- Linux (tested on Ubuntu 18.04 and 20.04)
- Postgresql 12 or later

## License
Yeap Application Server is [MIT licensed](./LICENSE).

