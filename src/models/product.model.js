const { model, Schema } = require("mongoose");

const PRODUCT_COLLECTION_NAME = "Products";
const ELECTRONIC_COLLECTION_NAME = "Electronics";
const CLOTHING_COLLECTION_NAME = "Clothings";
const FURNITURE_COLLECTION_NAME = "Furniture";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Furniture", "Clothing"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: PRODUCT_COLLECTION_NAME,
    timestamps: true,
  },
);

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: { type: String, required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    collection: CLOTHING_COLLECTION_NAME,
    timestamps: true,
  },
);

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    collection: ELECTRONIC_COLLECTION_NAME,
    timestamps: true,
  },
);

const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: { type: String, required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    collection: FURNITURE_COLLECTION_NAME,
    timestamps: true,
  },
);

module.exports = {
  product: model(PRODUCT_COLLECTION_NAME, productSchema),
  electronic: model(ELECTRONIC_COLLECTION_NAME, electronicSchema),
  clothing: model(CLOTHING_COLLECTION_NAME, clothingSchema),
  furniture: model(FURNITURE_COLLECTION_NAME, furnitureSchema),
};
