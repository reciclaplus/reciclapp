// Import environment configuration
const { config, API_URL: envApiUrl, conf: envConf } = require('./config/environment.js');

// Use environment-aware API URL
const API_URL = envApiUrl;

// Use the configuration from the environment module
const conf = envConf;

// Export for both CommonJS and ES6 modules
module.exports = { API_URL, conf };
module.exports.API_URL = API_URL;
module.exports.conf = conf;
