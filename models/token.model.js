const mongoose = require("mongoose");
const { Schema } = mongoose;
require("./user.model");

const TOKEN_STATUS = {
  ACTIVE: "ACTIVE",
  DELETED: "DELETED",
};

const tokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TOKEN_STATUS),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  TokenModel: mongoose.model("token", tokenSchema),
  TOKEN_STATUS,
};
