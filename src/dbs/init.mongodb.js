"use strict";
const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (true) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    const connectionString = `${type}+srv://preddevil:KAtCDDdtxzu3HfI9@phat-free-cluster.styqs.mongodb.net/`;
    mongoose
      .connect(connectionString)
      .then(() => {
        console.log("Connected to MongoDB.");
      })
      .catch((err) => console.log("Error connecting to MongoDB"));
  }

  disconnect() {
    mongoose.disconnect().then(() => console.log("All connections closed."));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
