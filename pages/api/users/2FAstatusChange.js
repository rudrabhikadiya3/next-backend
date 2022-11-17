import { dec, secretkeys } from "../../../helper/common";
import dbConnect from "../../../helper/DBconnect";
import Users from "../../../models/Users";
var speakeasy = require("speakeasy");

export default async function handler(req, res) {
  // api for 2FA status change in DB
  try {
    dbConnect();
    let bodyData = await JSON.parse(req.body);
    const { userOTP, uid } = bodyData;

    let user = await Users.findOne({ _id: uid });
    console.log("findedUser", user);
    // is otp incorrext/expired or not
    const isVerify = await speakeasy.totp.verify({
      secret: dec(user.base32, secretkeys.base32),
      encoding: "base32",
      token: userOTP,
    });
    if (isVerify) {
      // is2FAEnabel vice versa
      try {
        const update = await Users.updateOne(
          { _id: uid },
          { $set: { is2FAEnabel: user.is2FAEnabel ? false : true } }
        );
        res.status(200).json({
          success: true,
          message: user.is2FAEnabel
            ? `2FA disabled succesfully`
            : `2FA enable succesfully`,
        });
      } catch (error) {
        res.status(200).json({ success: false, message: error.message });
      }
    } else {
      // if isVerify === false
      res
        .status(200)
        .json({ success: false, message: `OTP is expired or wrong` });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
}
