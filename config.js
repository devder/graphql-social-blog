const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    DATABASEURI: process.env.databaseURI,
    SECRET_KEY: process.env.secretKey
}