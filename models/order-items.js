const mongoose = require("mongoose");
const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

exports.OrderItem = mongoose.model("OrderItem", orderItemSchema);
