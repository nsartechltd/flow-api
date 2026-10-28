// serverless-offline is ESM-only; Serverless 3 cannot tag the module namespace
// that require() returns on Node 22+, so re-export the plugin class directly.
module.exports = require('serverless-offline').default;
