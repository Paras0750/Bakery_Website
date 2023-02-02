const mongoose = require("mongoose");

const cakeSchema = {
  itemID: Number,
  name: String,
  imgUrl: String,
  price: Number,
  orignalPrice: Number,
};

module.exports = mongoose.model("SellingItem", cakeSchema);
