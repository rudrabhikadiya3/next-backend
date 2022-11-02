import User from "../../../models/User";
import dbConnect from "../../../middleware/DBconnect";

export default async function handler(req, res) {
  dbConnect();
  const data = JSON.parse(req.body);
  console.log("req", data);
  console.log("id", data.id);
  try {
    const user = await User.updateOne(
      { _id: data.id },
      { $set: { name: data.name } }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
