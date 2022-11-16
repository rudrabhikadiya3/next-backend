import dbConnect from "../../../helper/DBconnect";
import Users from "../../../models/Users";
export default async function handler(req, res) {
  dbConnect();
  try {
    const id = await req.query.id;
    const user = await Users.findOne({ _id: id });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
