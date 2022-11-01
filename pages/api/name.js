import User from "../../models/User";

import dbConnect from "../../middleware/DBconnect";
export default async function handler(req, res) {
  dbConnect();
  if (req.method === "POST") {
    try {
      const user = await User.create({ name: req.body });
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else if (req.method === "DELETE") {
  } else {
    try {
      const user = await User.find({});
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}
