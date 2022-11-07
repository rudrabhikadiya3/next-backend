import Product from "../../models/Products";
import dbConnect from "../../middleware/DBconnect";

export default async function handler(req, res) {
  dbConnect();
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
