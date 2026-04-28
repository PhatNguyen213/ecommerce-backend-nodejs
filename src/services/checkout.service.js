"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
  /*
     * {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [
                        {
                            shopId,
                            discountId,
                            codeId
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]

                }
            ]
     * }
     */

  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartById(cartId);

    if (!foundCart) throw new NotFoundError("Cart does not exists.");

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    const shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts, item_products } = shop_order_ids[i];

      const products = checkProductByServer(item_products);

      const checkoutPrice = (await products).reduce((accumulation, product) => {
        return accumulation + product.quantity * product.price;
      }, 0);

      checkout_order.totalPrice += checkoutPrice;

      const item_checkout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: products,
      };

      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discountAmount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products,
        });

        checkout_order.totalDiscount += discountAmount;
        if (discountAmount > 0) {
          item_checkout.priceApplyDiscount = checkoutPrice - discountAmount;
        }
      }

      checkout_order.totalCheckout += item_checkout.priceApplyDiscount;
      shop_order_ids_new.push(item_checkout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }
}

module.exports = CheckoutService;
