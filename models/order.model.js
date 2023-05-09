const mongoose = require("mongoose");
const { Schema } = mongoose;

require("./user.model");
require("./product.model");

const ORDER_TYPE = {
  INCART: "INCART",
  ORDERED: "ORDERED",
  DELETED: "DELETED",
};

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        _id: false,
      },
    ],
    status: {
      type: String,
      enum: Object.values(ORDER_TYPE),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  OrderModel: mongoose.model("order", orderSchema),
  ORDER_TYPE,
};
