import dbConnect from "../../../helper/DBconnect";
import Users from "../../../models/Users";
export default async function handler(req, res) {
  dbConnect();

  try {
    let data = JSON.parse(req.body);
    console.log("id", data.id);
    const users = await Users.findOne({ _id: data.id });
    console.log("user otp", data.otp);
    console.log("db otp", users.otp);

    const betweenTime = Date.now() - users.otpGenerateTime;
    const fiveMin = 60000;

    console.log("betweenTime", betweenTime);
    if (betweenTime < fiveMin) {
      if (Number(data.otp) === users.otp) {
        const user = await Users.updateOne(
          { _id: data.id },
          {
            $set: {
              isEmailVerfied: true,
            },
          }
        );
        res.status(200).json({ success: true, message: `Email verified` });
      } else {
        res.status(200).json({ success: false, message: `incorrect OTP!` });
      }
    } else {
      res.status(200).json({ success: false, message: `otp has been expired` });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Something went wrong`,
    });
  }
}
