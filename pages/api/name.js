import User from "../../models/User";
import dbConnect from "../../middleware/DBconnect";

export default async function handler(req, res) {
  dbConnect();
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
