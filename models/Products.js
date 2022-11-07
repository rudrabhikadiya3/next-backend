import mongoose, { Schema } from "mongoose";
module.exports =
  mongoose.models.Products ||
  mongoose.model(
    "Products",
    new Schema({
      title: { type: String },
      bname: { type: String },
      catagory: { type: String },
      mrp: { type: String },
      price: { type: String },
      qty: { type: String },
      keywords: { type: String },
      img: { type: String },
    })
  );
