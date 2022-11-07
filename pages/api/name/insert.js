import dbConnect from "../../../helper/DBconnect";
import Name from "../../../models/Name";

export default async function handler(req, res) {
  dbConnect();
  console.log("body", req.body);
  try {
    const user = await Name.create({ name: req.body });
    res.status(200).json({ success: true, data: user });
    console.log("success");
  } catch (error) {
    res.status(400).json({ success: false });
    console.log("falied");
  }
}
