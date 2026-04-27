"use strict";

const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "pending", "completed", "failed"],
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_count_products: {
      type: Number,
      default: 0,
    },
    cart_userId: {
      type: Number,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "updatedOn",
    },
  },
);

module.exports = model(DOCUMENT_NAME, cartSchema);
