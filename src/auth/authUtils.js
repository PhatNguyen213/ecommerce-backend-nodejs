"use strict";

const jwt = require("jsonwebtoken");
const { createAsyncHandler } = require("./errorUtils");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADERS = {
  CLIENT_ID: "x-client-id",
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = createAsyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADERS.CLIENT_ID];

  if (!userId) {
    throw new UnauthorizedError("Invalid Request");
  }

  const keyStore = await findByUserId(userId);

  if (!keyStore) {
    throw new NotFoundError("No key found.");
  }

  const accessToken = req.headers[HEADERS.AUTHORIZATION];

  if (!accessToken) {
    throw new UnauthorizedError("Invalid Request");
  }

  try {
    const decodedPayload = jwt.verify(accessToken, keyStore.publicKey);
    if (decodedPayload.userId !== userId) {
      throw new UnauthorizedError("Invalid User.");
    }

    req.keyStore = keyStore;
    req.user = decodedPayload.userId;

    next();
  } catch (error) {
    throw error;
  }
});

const verifyJWTToken = (token, keySecret) => {
  return jwt.verify(token, keySecret);
};

module.exports = { createTokenPair, authentication, verifyJWTToken };
