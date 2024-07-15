const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  apartment: {
    type: String,
    default: "",
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", { virtuals: true });

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
