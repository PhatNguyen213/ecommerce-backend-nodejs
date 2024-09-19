const app = require("./src/app");
const mongoInstance = require('./src/dbs/init.mongodb')

const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log(`Ecommerce starts with port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server."));
  mongoInstance.disconnect()
});
