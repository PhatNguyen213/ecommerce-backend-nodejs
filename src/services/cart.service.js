"use strict";

const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

class CartService {
  static async createCart({ userId, product = {} }) {
    const query = { cart_userId: userId, cart_state: "active" };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateCartQuantity({ userId, product }) {
    const { quantity, productId } = product;
    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    };

    console.log("quantity", quantity);

    const updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };

    const options = {
      upsert: true,
      new: true,
    };

    console.log("aaaaa", query, updateSet);

    return await cartModel.findOneAndUpdate(query, updateSet, options);
  }

  static async addToCart({ userId, product = {} }) {
    const cart = await cartModel.findOne({ cart_userId: userId });

    if (!cart) {
      return await CartService.createCart({ userId, product });
    }

    if (cart.cart_products.length === 0) {
      cart.cart_products = [product];
      return await cart.save();
    }

    return await CartService.updateCartQuantity({ userId, product });
  }

  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity, shopId } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await getProductById(productId);

    if (!foundProduct) throw new NotFoundError("Product not found.");

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shop_id)
      throw new NotFoundError("ShopId not matching.");

    return await CartService.updateCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteCart({ userId, productId }) {
    const query = {
      cart_userId: userId,
      cart_state: "active",
    };

    const updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };

    return await cartModel.updateOne(query, updateSet);
  }

  static async getListCarts({ userId }) {
    return await cartModel.findOne({ cart_userId: userId }).lean();
  }
}

module.exports = CartService;
