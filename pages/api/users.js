import { enc, secretkeys } from "../../helper/common";
import dbConnect from "../../helper/DBconnect";
import Users from "../../models/Users";

export default async function handler(req, res) {
  dbConnect();

  if (req.method === "POST") {
    try {
      const userData = await JSON.parse(req.body);
      console.log("new user", userData);

      const emailExist = await Users.findOne({ email: userData.email });
      if (!emailExist) {
        const user = await Users.create({
          name: userData.name,
          email: userData.email,
          password: enc(userData.password, secretkeys.password),
        });
        res.status(201).json({
          success: true,
          data: user,
          message: "You are registerd successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "This email is already exist",
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
  } else {
    try {
      const users = await Users.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
}
