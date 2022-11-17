import dbConnect from "../../../helper/DBconnect";
import Name from "../../../models/Name";

export default async function handler(req, res) {
  dbConnect();
  const data = JSON.parse(req.body);
  try {
    const user = await Name.updateOne(
      { _id: data.id },
      { $set: { name: data.name } }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
