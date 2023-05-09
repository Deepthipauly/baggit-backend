const mongoose = require("mongoose");

const { Schema } = mongoose;
const CATEGORY_TYPE = {
  MEN: "MEN",
  WOMEN: "WOMEN",
};
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(CATEGORY_TYPE),
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    reviewCount: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    warranty: {
      type: Number,
      required: true,
    },
    dimensions: {
      type: String,
      required: true,
    },
    isNewArrival: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = {
  ProductModel: mongoose.model("product", productSchema),
  CATEGORY_TYPE,
};
