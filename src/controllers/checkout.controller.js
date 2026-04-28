"use strict";

const { OKResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  static checkoutReview = async (req, res, next) => {
    const response = new OKResponse({
      message: "Checkout Review successfully!",
      metadata: await CheckoutService.checkoutReview(req.body),
    });

    return response.send(res);
  };
}

module.exports = CheckoutController;
