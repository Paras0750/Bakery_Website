const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  order: { type: Schema.Types.ObjectId, ref: "SellingItem" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Orders", orderSchema);
