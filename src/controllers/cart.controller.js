"use strict";

const { OKResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");
const ProductService = require("../services/product.service");

class CartController {
  static addToCart = async (req, res, next) => {
    const response = new OKResponse({
      message: "Add to cart successfully!",
      metadata: await CartService.addToCart(req.body),
    });

    return response.send(res);
  };

  static update = async (req, res, next) => {
    const response = new OKResponse({
      message: "Update cart successfully!",
      metadata: await CartService.addToCartV2(req.body),
    });

    return response.send(res);
  };

  static delete = async (req, res, next) => {
    const response = new OKResponse({
      message: "Delete cart successfully!",
      metadata: await CartService.deleteCart(req.body),
    });

    return response.send(res);
  };

  static listCart = async (req, res, next) => {
    const response = new OKResponse({
      message: "Get list carts successfully!",
      metadata: await CartService.getListCarts(req.body),
    });

    return response.send(res);
  };
}

module.exports = CartController;
