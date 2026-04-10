"use strict";

const { update } = require("lodash");
const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      );

      return tokens ? tokens.publicKey : null;
    } catch (err) {
      return err;
    }
  };

  static findByUserId = async (userId) => {
    // return await keytokenModel.findOne({ user: Types.ObjectId(userId) }).lean();
    return await keytokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id);
  };

  static findByRefreshTokenUsed = async (token) => {
    return await keytokenModel.findOne({ refreshTokenUsed: token }).lean();
  };

  static findByRefreshToken = async (token) => {
    return await keytokenModel.findOne({ refreshToken: token });
  };

  static deleteKeyById = async (id) => {
    return await keytokenModel.findByIdAndDelete({ _id: id });
  };

  static updateRefreshTokenUsed = async (
    userId,
    refreshTokenUsed,
    newRefreshToken,
  ) => {
    return await keytokenModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      {
        $push: { refreshTokenUsed: refreshTokenUsed },
        refreshToken: newRefreshToken,
      },
    );
  };
}

module.exports = KeyTokenService;
