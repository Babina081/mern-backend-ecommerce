const { Order } = require("../models/order");
const express = require("express");
const { OrderItem } = require("../models/order-items");
const router = express.Router();

// .sort({"dateOrdered":-1}); sort newest to oldest
router.get("/", async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    // .populate("orderItems")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });
  if (!order) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(order);
});

router.post("/", async (req, res) => {
  // bcause orderitems is in array list
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderitem) => {
      let newOrderItem = new OrderItem({
        product: orderitem.product,
        quantity: orderitem.quantity,
      });
      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  console.log(orderItemsIdsResolved);
  console.log(totalPrices);
  //reduce method perform mathematical calculation
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) {
    return res.status(400).send("the order cannot be created!");
  }
  res.status(200).send(order);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndUpdate(
    id,
    { status: req.body.status },
    { new: true }
  );
  if (!order) {
    return res.status(400).send("the order cannot be updated");
  }
  res.status(200).send(order);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Order.findByIdAndDelete(id).then(async (order) => {
    if (order) {
      //deleting the order items as well
      await order.orderItems.map(async (orderItem) => {
        await OrderItem.findByIdAndDelete(orderItem);
      });
      return res
        .status(200)
        .json({ success: true, message: "the order is deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "order not found" });
    }
  });
});

router.get("/get/totalSales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }
  res.status(200).send({ totalSales: totalSales.pop().totalSales });
});

router.get("/get/count", async (req, res) => {
  const orderCount = await Order.countDocuments();
  if (!orderCount) {
    return res.status(500).json({ success: false });
  }
  res.status(200).send({ orderCount: orderCount });
});

router.get("/get/userorders/:userid", async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dataOrdered: -1 });
  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(userOrderList);
});
module.exports = router;
