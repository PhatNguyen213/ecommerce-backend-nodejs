const { model, Schema } = require("mongoose");

const PRODUCT_COLLECTION_NAME = "Products";
const ELECTRONIC_COLLECTION_NAME = "Electronics";
const CLOTHING_COLLECTION_NAME = "Clothings";
const FURNITURE_COLLECTION_NAME = "Furniture";

const slugify = require("slugify");

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Furniture", "Clothing"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: PRODUCT_COLLECTION_NAME,
    timestamps: true,
  },
);

// create index for name and description for full-text search
productSchema.index({ product_name: "text", product_description: "text" });

// document middleware (before save() and create())
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

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
