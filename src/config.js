const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  dbName: process.env.DB_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
};
