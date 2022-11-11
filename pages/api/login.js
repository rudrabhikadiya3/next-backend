import { dec, secretkeys } from "../../helper/common";
import dbConnect from "../../helper/DBconnect";
import Users from "../../models/Users";

export default async function handler(req, res) {
  dbConnect();

  if (req.method === "POST") {
    const credentials = req.body;
    console.log(`credentials`, credentials);
    let isUser = await Users.findOne({ email: credentials.email });
    try {
      if (isUser) {
        if (
          credentials.password === dec(isUser.password, secretkeys.password)
        ) {
          if (isUser.isEmailVerfied) {
            return res.status(201).json({
              success: true,
              isEmailVerfied: true,
              user: isUser,
              message: `Login succesfully`,
            });
          } else {
            return res.status(201).json({
              success: false,
              isEmailVerfied: false,
              message: `Please verify your email`,
              user: isUser,
            });
          }
        } else {
          return res
            .status(400)
            .json({ success: false, message: `invalid credentials` });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: `${credentials.email} is not registred`,
        });
      }
    } catch (error) {
      return res.status(400).json({ success: false, message: error });
    }
  } else {
    try {
      return res.status(404).send({
        success: false,
        message: `${req.method} method is not allowed`,
      });
    } catch (error) {
      return res.status(400).send({ success: false, message: error });
    }
  }
}
