import dbConnect from "../../../helper/DBconnect";
import Users from "../../../models/Users";
export default async function handler(req, res) {
  dbConnect();

  try {
    let data = JSON.parse(req.body);
    console.log("id", data.id);

    let user = await Users.findOne({ _id: data.id });
    console.log("user otp", data.otp);
    console.log("db otp", user.otp);

    const betweenTime = Date.now() - user.otpGenerateTime;
    const fiveMin = 60000;

    if (betweenTime < fiveMin) {
      if (Number(data.otp) === user.otp) {
        const setEmailVerify = await Users.updateOne(
          { _id: data.id },
          {
            $set: {
              isEmailVerfied: true,
            },
          }
        );
        let user = await Users.findOne({ _id: data.id });
        console.log(user);
        res
          .status(200)
          .json({ success: true, user, message: `Email verified` });
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
