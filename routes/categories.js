const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
//for multiple images
const multer = require("multer");
const { default: mongoose } = require("mongoose");

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

router.get("/", async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(500).json({
      success: false,
      message: "the category with the given id was not found",
    });
  }
  res.status(200).send(category);
});

router.post("/", uploadOptions.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res
      .status(400)
      .send({ success: false, message: "the image file cannot be found" });
  }
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
    image: `${basePath}${fileName}`,
  });

  category = await category.save();

  if (!category) {
    return res.status(404).send("the category cannot be created");
  }

  res.send(category);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Category.findByIdAndDelete(id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "the category is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "category not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  const { id } = req.params;
  // validating id
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send("Invalid product id");
  }
  console.log("id is", id);
  const file = req.file;
  console.log(file);
  if (!file) {
    return res
      .status(400)
      .send({ success: false, message: "the image file cannot be found" });
  }
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  console.log("Updating category with ID:", id);
  console.log("Update data:", {
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
    image: `${basePath}${fileName}`,
  });

  let category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
      image: `${basePath}${fileName}`,
    },
    { new: true }
  );

  console.log("category is", category);
  if (!category) {
    return res.status(400).send("the category cannot be updated");
  }
  res.status(200).send({ category });
});

module.exports = router;
