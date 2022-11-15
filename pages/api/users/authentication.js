import dbConnect from "../../../helper/DBconnect";
import Users from "../../../models/Users";
var speakeasy = require("speakeasy");
var QRCode = require("qrcode");
export default async function handler(req, res) {
  dbConnect();
  try {
    let coockie = JSON.parse(req.body);
    console.log("id", coockie.uid);
    let user = await Users.findOne({ _id: coockie.uid });
    console.log("user", user);
    if (!user.is2FAEnabel) {
      let secret = await speakeasy.generateSecret();
      console.log("secret", secret);
      let generateQR = await QRCode.toDataURL(secret.otpauth_url);

      let update = await Users.updateOne(
        { _id: coockie.uid },
        { $set: { QRcode: generateQR, base32: secret.base32 } }
      );
      console.log("user", update);
      console.log("id in if", coockie.uid);
      // console.log("QR link", generateQR);
      let user = await Users.findOne({ _id: coockie.uid });
      console.log("resp", user);
      res
        .status(200)
        .json({ success: true, user, message: `2FA is enabled successfully` });
    } else {
      res
        .status(200)
        .json({ success: false, message: `2FA is already enabled` });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
}
