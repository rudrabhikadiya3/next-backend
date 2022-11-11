import dbConnect from "../../../helper/DBconnect";
import Users from "../../../models/Users";
export default async function handler(req, res) {
  dbConnect();

  if (req.method === "PUT") {
    try {
      const userId = JSON.parse(req.body);
      console.log("userId", userId);
      const user = await Users.updateOne(
        { _id: userId },
        {
          $set: {
            otp: Math.floor(Math.random() * 100000),
            otpGenerateTime: Date.now(),
          },
        }
      );

      res
        .status(200)
        .json({ success: true, message: `otp resend succusfully` });
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  }
}
