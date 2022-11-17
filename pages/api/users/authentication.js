import { enc, secretkeys } from "../../../helper/common";
import dbConnect from "../../../helper/DBconnect";
import Users from "../../../models/Users";
var speakeasy = require("speakeasy");
var QRCode = require("qrcode");

// generate details for authentication (speakeasy) and set in document
export default async function handler(req, res) {
  dbConnect();
  try {
    const cookie = req.body;
    let user1 = await Users.findOne({ _id: cookie });
    if (!user1.is2FAEnabel) {
      let secret = await speakeasy.generateSecret({
        name: "myweb.com", // name appear in auth app
      });

      let update = await Users.updateOne(
        { _id: cookie },
        {
          $set: {
            base32: enc(secret.base32, secretkeys.base32),
          },
        }
      );

      let generateQR = await QRCode.toDataURL(secret.otpauth_url);
      let upadatedUser = await Users.findOne({ _id: cookie });

      res.status(200).json({
        success: true,
        QR: generateQR,
        user: upadatedUser,
        message: `please scan code in app`,
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
