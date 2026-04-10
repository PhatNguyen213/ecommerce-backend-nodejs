"use strict";

const { CreatedResponse, OKResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    const response = new OKResponse({
      message: "Get token successfully!",
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    });

    return response.send(res);
  };
  login = async (req, res, next) => {
    const response = new OKResponse({
      message: "Login successfully!",
      metadata: await AccessService.login(req.body),
    });

    return response.send(res);
  };
  logout = async (req, res, next) => {
    const response = new OKResponse({
      message: "Logout successfully!",
      metadata: await AccessService.logout(req.keyStore),
    });

    return response.send(res);
  };
  signup = async (req, res, next) => {
    const response = new CreatedResponse({
      message: "Registered successfully!",
      metadata: await AccessService.signup(req.body),
    });

    return response.send(res);
  };
}

module.exports = new AccessController();
