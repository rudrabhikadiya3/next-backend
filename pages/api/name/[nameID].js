import User from "../../../models/User";

export default async function handler(req, res) {
  const { nameID } = req.query;
  const singleName = await User.findOne({ _id: nameID });
  res.end(JSON.stringify([singleName]));
}
