"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWTToken } = require("../auth/authUtils");
const { getData } = require("../utils");
const {
  ForbiddenRequestError,
  InternalServerError,
  BadRequestError,
  UnauthorizedError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /**
   * When access token is expired, this handler will be hit.
   * If token is found in the used (blacklist) array, remove the keystore for this shop
   * and throw error and force re-login for both current valid and suspiscious users.
   * If not, create new token pairs, and save this old refresh token into the used array.
   */
  static handleRefreshToken = async (refreshToken) => {
    const foundKeyForUsedToken =
      await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundKeyForUsedToken) {
      const { userId } = verifyJWTToken(
        refreshToken,
        foundKeyForUsedToken.publicKey,
      );

      await KeyTokenService.deleteKeyById(userId);

      throw new ForbiddenRequestError("Something is wrong. Please re-login.");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

    if (!holderToken) {
      throw new UnauthorizedError("Shop not registered.");
    }

    const { userId, email } = verifyJWTToken(
      refreshToken,
      holderToken.publicKey,
    );

    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new UnauthorizedError("Shop not registered.");
    }

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey,
    );

    await KeyTokenService.updateRefreshTokenUsed(
      userId,
      refreshToken,
      tokens.refreshToken,
    );

    return {
      user: { userId, email },
      tokens,
    };
  };
  static logout = async (keyStore) => {
    console.log("keystore", keyStore);
    const deletedKey = await KeyTokenService.removeKeyById(keyStore._id);

    return deletedKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const shop = await findByEmail({ email });

    if (!shop) {
      throw new BadRequestError("Shop Not Found.");
    }

    console.log("PASSWORD", password, shop);
    const match = bcrypt.compare(password, shop.password);

    if (!match) {
      throw new UnauthorizedError("Authentication error.");
    }

    // create publicKey, privateKey
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const tokens = await createTokenPair(
      { userId: shop._id, email },
      publicKey,
      privateKey,
    );

    await KeyTokenService.createKeyToken({
      userId: shop._id,
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
    });

    return {
      shop: getData(["name", "email", "_id"], shop),
      tokens,
    };
  };

  static signup = async ({ name, email, password }) => {
    // check email exists
    const shop = await shopModel.findOne({ email }).lean();
    if (shop) {
      throw new BadRequestError("Error: Shop already registered.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // create publicKey, privateKey
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
        throw new InternalServerError("publicKeyString error.");
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKeyString,
        privateKey,
      );

      return {
        code: 201,
        metadata: {
          shop: getData(["name", "email", "_id"], newShop),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
