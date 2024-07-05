const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  shippingAddress1: {
    type: String,
    default: true,
  },
  shippingAddress2: {
    type: String,
  },
  city: {
    type: String,
    default: true,
  },
  zip: {
    type: String,
    default: true,
  },
  country: {
    type: String,
    default: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  vrituals: true,
});

exports.Order = mongoose.model("Order", orderSchema);
