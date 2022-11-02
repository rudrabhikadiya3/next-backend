import User from "../../../models/User";
import dbConnect from "../../../middleware/DBconnect";

export default async function handler(req, res) {
  dbConnect();
  try {
    const user = await User.deleteOne({ _id: req.body });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
