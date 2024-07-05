const express = require("express");
const Product = require("../models/products");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");

// http://localhost:3000/api/v1/products
router.get(`/`, async (req, res) => {
  //   const products = {
  //     id: 1,
  //     name: "hair dresser",
  //     image: "some_url",
  //   };

  //get only specific fields
  // const productList = await Product.find().select("name image -_id");

  //http://localhost:3000/api/v1/products?categories=1,2,3
  //
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(filter).populate("category");

  // const productList = await Product.find().populate("category");
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  //populate gives sub data of the items connected to the  database
  const product = await Product.findById(id).populate("category");
  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

router.post(`/`, async (req, res) => {
  //   const newProduct = req.body;
  //   console.log(newProduct);
  //   res.send(newProduct);

  const category = await Category.findById(req.body.category);
  //validating category
  if (!category) {
    return res
      .status(400)
      .send({ success: false, message: "the category cannot be found" });
  }

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) {
    return res
      .status(400)
      .send({ success: false, message: "the product cannot be created" });
  }

  res.send({ success: true, product });
  // product
  //   .save()
  //   .then((createdProduct) => {
  //     res.status(201).json(createdProduct);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({ error: err, success: false });
  //   });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  // validating id
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send("Invalid product id");
  }

  //validating category
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res
      .status(400)
      .send({ success: false, message: "the category cannot be found" });
  }

  const product = await Product.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!product) {
    return res.status(500).send("the product cannot be updated");
  }
  res.send(product);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Product.findByIdAndDelete(id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({ count: productCount });
});

router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const productFeatured = await Product.find({ isFeatured: true }).limit(
    +count
  );

  if (!productFeatured) {
    res.status(500).json({ success: false });
  }
  res.send(productFeatured);
});

module.exports = router;
