const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountCodesUnselect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectIdMongo } = require("../utils");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      name,
      description,
      type,
      value,
      code,
      start_date,
      end_date,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
      min_order_value,
      shopId,
      is_active,
      applies_to,
      product_ids,
    } = payload;

    if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expired.");
    }

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError("Start date must be before End date");
    }

    const found = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongo(shopId),
      })
      .lean();

    if (found && found.discount_is_active) {
      throw new BadRequestError("Discount already exists.");
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses, // maximum number of uses
      discount_uses_count: uses_count, // current number of uses
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });
  }

  static async updateDiscountCode() {}

  static async getAllProductsAssociatedWithDiscountCode({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const found = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongo(shopId),
      })
      .lean();

    if (!found) {
      throw new BadRequestError("Discount does not exist.");
    }

    const { discount_applies_to, discount_product_ids } = found;
    console.log(found);

    if (discount_applies_to === "all") {
      return await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongo(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      console.log("herrrrr");
      return await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return [];
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongo(shopId),
        discount_is_active: true,
      },
      unSelect: ["_v", "discount_shopId"],
      model: discountModel,
    });

    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const found = await checkDiscountExists({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongo(shopId),
    });

    if (!found) {
      throw new BadRequestError("Discount does not exist.");
    }

    if (!found.discount_is_active) {
      throw new BadRequestError("Discount expired.");
    }

    if (!found.discount_max_uses_per_user) {
      throw new BadRequestError("Discount is out.");
    }

    let total = 0;
    if (found.discount_min_order_value > 0) {
      total = products.reduce(
        (accumulation, prod) => accumulation + prod.quantity * prod.price,
        0,
      );

      if (total < found.discount_min_order_value)
        throw new BadRequestError(
          `Discount requires a minimum value of ${found.discount_min_order_value}`,
        );
    }

    const amount =
      found.discount_type === "fixed amount"
        ? found.discount_value
        : total * (found.discount_value / 100);

    return {
      totalOrder: total,
      discountAmount: amount,
      totalPrice: total - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    return await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongo(codeId),
    });
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const found = await checkDiscountExists({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongo(shopId),
    });

    if (!found) throw new NotFoundError("discount does not exist.");

    const result = await discountModel.findByIdAndUpdate(found._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
