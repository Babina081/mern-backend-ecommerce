const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

//bycrypt password
//bcryptjs
const bcrypt = require("bcrypt");

//creating token of user
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res.status(500).json({ success: false });
  }
  res.send(user);
});

router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    //encrpting password
    passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
    phone: req.body.phone,
    street: req.body.street,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    apartment: req.body.apartment,
  });
  user = await user.save();

  if (!user) {
    return res.status(400).send("the user cannot be created!");
  }
  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(500).json({ success: false });
  } else if (!req.body.password || !user.passwordHash) {
    res.status(400).json({ message: "Missing password or password hash" });
  } else {
    //checking whether the password of the user entered and the password in the server matches or not
    if (user && bcrypt.compare(req.body.password, user.passwordHash)) {
      //creating token
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        //   can put any secret key value
        process.env.SECRET,
        //expiration of token
        {
          expiresIn: "1d",
        }
      );
      res.status(200).send({
        user: user.email,
        token: token,
        success: true,
        message: "user is authenticated",
      });
    } else {
      res.status(400).send("password is wrong!");
    }
  }

  //   return res.status(200).send(user);
});

router.get("/get/count", async (req, res) => {
  const userCount = await User.countDocuments();
  if (!userCount) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).send({ count: userCount });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!user) {
    return res.status(400).send("the user cannot be created!");
  }
  res.status(200).send(user);
});

module.exports = router;
