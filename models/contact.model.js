const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("contact", contactSchema);
