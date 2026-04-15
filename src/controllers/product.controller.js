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

  static publishProduct = async (req, res, next) => {
    const response = new OKResponse({
      message: "Publish product successfully!",
      metadata: await ProductService.publishProduct({
        product_shop: req.user,
        product_id: req.params.id,
      }),
    });

    return response.send(res);
  };

  static unPublishProduct = async (req, res, next) => {
    const response = new OKResponse({
      message: "Unpublish product successfully!",
      metadata: await ProductService.unPublishProduct({
        product_shop: req.user,
        product_id: req.params.id,
      }),
    });

    return response.send(res);
  };

  static getAllDraft = async (req, res, next) => {
    const response = new OKResponse({
      message: "Get all drafts successfully!",
      metadata: await ProductService.findAllDrafts({
        product_shop: req.user,
      }),
    });

    return response.send(res);
  };

  static getAllPublished = async (req, res, next) => {
    const response = new OKResponse({
      message: "Get all published successfully!",
      metadata: await ProductService.findAllPublished({
        product_shop: req.user,
      }),
    });

    return response.send(res);
  };

  static searchProduct = async (req, res, next) => {
    const response = new OKResponse({
      message: "Search product successfully!",
      metadata: await ProductService.searchProducts(req.params),
    });

    return response.send(res);
  };
}

module.exports = ProductController;
