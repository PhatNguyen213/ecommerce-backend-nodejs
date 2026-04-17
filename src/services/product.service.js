"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../models/product.model");
const {
  publishProduct,
  queryProduct,
  unPublishProduct,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedProperties, updateNestedObject } = require("../utils");

// define Factory class to create product
class ProductFactory {
  /**
   * type: 'Clothing'
   * payload
   */
  static productRegistry = {};

  static registerProductType(type, classRef) {
    this.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const ProductClass = this.productRegistry[type];

    if (!ProductClass) throw new BadRequestError("Invalid Product type");

    return new ProductClass(payload).createProduct();
  }

  static async updateProduct(type, product_id, payload) {
    const ProductClass = this.productRegistry[type];

    if (!ProductClass) throw new BadRequestError("Invalid Product type");

    const updatePayload = removeUndefinedProperties(
      updateNestedObject(payload),
    );
    return new ProductClass(payload).updateProduct(product_id, updatePayload);
  }

  static async findAllDrafts({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return queryProduct({ query, limit, skip });
  }

  static async findAllPublished({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return queryProduct({ query, limit, skip });
  }

  static async publishProduct({ product_shop, product_id }) {
    return await publishProduct({ product_shop, product_id });
  }

  static async unPublishProduct({ product_shop, product_id }) {
    return await unPublishProduct({ product_shop, product_id });
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_description", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unselect: ["__v"] });
  }
}

// base Product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }

  async updateProduct(product_id, payload) {
    return await updateProductById({
      product_id,
      payload,
      model: product,
    });
  }
}

// create Product sub-types for different types of products
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing) {
      throw new BadRequestError("Cannot create new clothing product");
    }

    const newProduct = await super.createProduct(newClothing._id);

    if (!newProduct) {
      throw new BadRequestError("Cannot create new product");
    }

    return newProduct;
  }

  async updateProduct(product_id, payload) {
    if (this.product_attributes) {
      await updateProductById({
        product_id,
        payload,
        model: clothing,
      });
    }

    const updatedProduct = await super.updateProduct(product_id, payload);

    return updatedProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronic) {
      throw new BadRequestError("Cannot create new electronic product");
    }

    const newProduct = await super.createProduct(newElectronic._id);

    if (!newProduct) {
      throw new BadRequestError("Cannot create new product");
    }

    return newProduct;
  }

  async updateProduct(product_id, payload) {
    if (this.product_attributes) {
      await updateProductById({
        product_id,
        payload,
        model: electronic,
      });
    }

    const updatedProduct = await super.updateProduct(product_id, payload);

    return updatedProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newFurniture) {
      throw new BadRequestError("Cannot create new furniture product");
    }

    const newProduct = await super.createProduct(newFurniture._id);

    if (!newProduct) {
      throw new BadRequestError("Cannot create new product");
    }

    return newProduct;
  }

  async updateProduct(product_id, payload) {
    if (this.product_attributes) {
      await updateProductById({
        product_id,
        payload,
        model: furniture,
      });
    }

    const updatedProduct = await super.updateProduct(product_id, payload);

    return updatedProduct;
  }
}

ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
