require("dotenv").config();
const { API_SECRET } = process.env;

module.exports = {
    secret: API_SECRET
};