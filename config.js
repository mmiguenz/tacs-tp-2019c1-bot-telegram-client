const config = require('./config.json');

const enviroment = process.env.NODE_ENV || 'development';

module.exports = config[enviroment];