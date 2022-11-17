import { dec, secretkeys } from "../../../helper/common";
import dbConnect from "../../../helper/DBconnect";
import Users from "../../../models/Users";
var speakeasy = require("speakeasy");

export default async function handler(req, res) {
  // verify 2FA otp during login
  dbConnect();
  try {
    let bodyData = await JSON.parse(req.body);
    const { userOTP, uid } = bodyData;
    console.log("2FAotpVerfiy body", bodyData);
    let user = await Users.findOne({ _id: uid });
    const isVerify = await speakeasy.totp.verify({
      secret: dec(user.base32, secretkeys.base32),
      encoding: "base32",
      token: userOTP,
    });
    if (isVerify) {
      res
        .status(200)
        .json({ success: true, user, message: "login succesfully" });
    } else {
      res.status(200).json({ success: false, message: "OTP expired or wrong" });
    }
  } catch (error) {
    res.status(200).json({ success: false, message: error + "failed" });
  }
}
