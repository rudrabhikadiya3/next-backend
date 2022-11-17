import { enc, secretkeys } from "../../../helper/common";
import dbConnect from "../../../helper/DBconnect";
import Users from "../../../models/Users";
var speakeasy = require("speakeasy");
var QRCode = require("qrcode");

// generate details for authentication (speakeasy) and set in document
export default async function handler(req, res) {
  dbConnect();
  try {
    const coockie = JSON.parse(req.body);
    console.log("coockie", coockie);
    let user = await Users.findOne({ _id: coockie.uid });
    if (!user.is2FAEnabel) {
      let secret = await speakeasy.generateSecret({
        name: "myweb.com", // name appear in auth app
      });

      let generateQR = await QRCode.toDataURL(secret.otpauth_url);

      let update = await Users.updateOne(
        { _id: coockie.uid },
        {
          $set: {
            base32: enc(secret.base32, secretkeys.base32),
          },
        }
      );

      let user = await Users.findOne({ _id: coockie.uid });
      res.status(200).json({
        success: true,
        QR: generateQR,
        user,
        message: `please scan code in app`,
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
}
