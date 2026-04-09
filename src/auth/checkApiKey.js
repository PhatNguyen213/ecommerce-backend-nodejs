"use strict";

const { findById } = require("../services/apiKey.service");

const HEADERS = {
  API_KEY: "x-api-key",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADERS.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    const objKey = await findById(key);

    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    req.objKey = objKey;

    return next();
  } catch (err) {}
};

const permission = (perm) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied.",
      });
    }

    const valid = req.objKey.permissions.includes(perm);

    if (!valid) {
      return res.status(403).json({
        message: "Permission Denied.",
      });
    }

    return next();
  };
};

module.exports = { apiKey, permission };
