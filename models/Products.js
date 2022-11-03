const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    pname: "",
    bname: "",
    catagory: "",
    mrp: "",
    price: "",
    qty: "",
    keywords: "",
  },
  { timestamps: true }
);

export default mongoose.model("Order", productsSchema);
