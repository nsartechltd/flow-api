# Flow API

## Prerequisites

To use this repo you will need the following:

1. [nvm][nvm] - [see here](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script) for installation details.
2. [Node.js v20][nodejs]: If you have `nvm` installed you can run `nvm install 20` to install (this is recommended).
3. [Docker][docker]: Install Docker for running the API locally

## Running locally

```bash
# install dependencies
$ npm i

# start local server
$ docker compose up --build

# run integration tests (make sure server is started)
$ npm test
```

[nvm]: https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script
[nodejs]: https://nodejs.org/
[docker]: https://docs.docker.com/desktop/install/mac-install/