"use strict";

const { OKResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  static createProduct = async (req, res, next) => {
    const response = new OKResponse({
      message: "Create product successfully!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user,
      }),
    });

    return response.send(res);
  };
}

module.exports = ProductController;
