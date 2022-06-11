require("dotenv").config();
const {
    DB_HOSTNAME,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_DIALECT
} = process.env;

module.exports = {
    HOST: DB_HOSTNAME,
    USER: DB_USERNAME,
    PASSWORD: DB_PASSWORD,
    BD: DB_NAME,
    DIALECT: DB_DIALECT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};