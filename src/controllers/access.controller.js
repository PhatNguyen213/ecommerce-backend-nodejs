"use strict";

const { CreatedResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signup = async (req, res, next) => {
    const response = new CreatedResponse({
      message: "Registered successfully!",
      metadata: await AccessService.signup(req.body),
    });

    return response.send(res);
  };
}

module.exports = new AccessController();
