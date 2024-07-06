const express = require("express");
const Product = require("../models/products");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
//for multiple images
const multer = require("multer");

const FILE_TYPE_MAP = {
  // MIME TYPE
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    // const fileName = file.originalname.replace(" ", "-");
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});
// console.log(Date.now());

const uploadOptions = multer({ storage: storage });

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

router.post(`/`, uploadOptions.single("image"), async (req, res) => {
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
  const file = req.file;
  if (!category) {
    return res
      .status(400)
      .send({ success: false, message: "the category cannot be found" });
  }
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
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

//use .any() instead of .array('images',10) for multiple images
router.put("/gallery-images/:id", uploadOptions.any(), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }
  const files = req.files;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  if (files) {
    files.forEach((file) => {
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { images: imagesPaths },
    { new: true }
  );
  if (!product) {
    return res.status(500).send("the gallery cannot be updated");
  }
  res.status(200).send(product);
});

module.exports = router;
