const { Order } = require("../models/order");
const express = require("express");
const { OrderItem } = require("../models/order-items");
const router = express.Router();

router.get("/", async (req, res) => {
  const orderList = await Order.find();

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.post("/", async (req, res) => {
  // bcause orderitems is in array list
  const orderItemsIds = req.body.orderItems.map(async (orderitem) => {
    let newOrderItem = new OrderItem({
      product: orderitem.product,
      quantity: orderitem.quantity,
    });
    newOrderItem = await newOrderItem.save();

    return newOrderItem._id;
  });

  console.log(orderItemsIds);
  let order = new Order({
    orderItems: orderItemsIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });
  // order = await order.save();
  if (!order) {
    return res.status(400).send("the order cannot be created!");
  }
  res.status(200).send(order);
});

module.exports = router;
