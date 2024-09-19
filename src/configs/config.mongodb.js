const dev = {
  app: {
    port: process.env.DEV_PORT,
  },
  db: {
    host: process.env.DEV_DB_HOST,
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
  },
};

const prod = {
  app: {
    port: process.env.PROD_PORT,
  },
  db: {
    host: process.env.PROD_DB_HOST,
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
  },
};

const config = { dev, prod };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
