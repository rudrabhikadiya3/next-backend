import User from "../../../models/User";
import dbConnect from "../../../middleware/DBconnect";

export default async function handler(req, res) {
  dbConnect();
  console.log("body", req.body);
  try {
    const user = await User.create({ name: req.body });
    res.status(200).json({ success: true, data: user });
    console.log("success");
  } catch (error) {
    res.status(400).json({ success: false });
    console.log("falied");
  }
}
