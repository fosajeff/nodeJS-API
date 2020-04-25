require("dotenv").config();

module.exports = {
  DB_URL: process.env.DB_URL,
  HOST: process.env.HOST,
  SECRET_KEY: process.env.SECRET_KEY
}
