const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true },
    product: [
      {
        pID: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
    address: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: "Pending", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
