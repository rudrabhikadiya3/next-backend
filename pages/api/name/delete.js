import dbConnect from "../../../helper/DBconnect";
import Name from "../../../models/Name";

export default async function handler(req, res) {
  dbConnect();
  try {
    const user = await Name.deleteOne({ _id: req.body });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
