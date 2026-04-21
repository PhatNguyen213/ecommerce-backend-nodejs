const { BadRequestError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountCodesUnselect,
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

    const found = discountModel
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
    const found = discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongo(shopId),
      })
      .lean();

    if (!found || !found.discount_is_active) {
      throw new BadRequestError("Discount does not exist.");
    }

    const { discount_applies_to, discount_product_ids } = found;

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
}
