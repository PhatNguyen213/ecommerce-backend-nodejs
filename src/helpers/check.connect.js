"use strict";

const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");
const INTERVAL = 5000;
const maxConnectionsPerCore = 5;

const countConnections = () => {
  const numConnections = mongoose.connections.length;
  console.log(`Number of connections: ${numConnections}`);
};

const checkOverload = () => {
  // monitor every 5 seconds
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnections = numCores * maxConnectionsPerCore;

    if (numConnections > maxConnections) {
      console.log("Connection overload detected.");
    }

    console.log(`Active connections: ${numConnections}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
  }, INTERVAL);
};

module.exports = {
  countConnections,
  checkOverload,
};
