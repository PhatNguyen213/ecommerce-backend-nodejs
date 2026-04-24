"use strict";

const { OKResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  static createDiscountCode = async (req, res, next) => {
    const response = new OKResponse({
      message: "Create discount successfully!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user,
      }),
    });

    return response.send(res);
  };

  static getAllDiscountCodes = async (req, res, next) => {
    const response = new OKResponse({
      message: "Get discounts successfully!",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.body,
        shopId: req.user,
      }),
    });

    return response.send(res);
  };

  static getDiscountAmount = async (req, res, next) => {
    const response = new OKResponse({
      message: "Get discount amount successfully!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    });

    return response.send(res);
  };

  static getAllDiscountCodesWithProducts = async (req, res, next) => {
    const response = new OKResponse({
      message: "Get discounts with products successfully!",
      metadata: await DiscountService.getAllProductsAssociatedWithDiscountCode({
        ...req.query,
      }),
    });

    return response.send(res);
  };
}

module.exports = DiscountController;
