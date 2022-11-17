import mongoose, { Schema } from "mongoose";
module.exports =
  mongoose.models.Users ||
  mongoose.model(
    "Users",
    new Schema(
      {
        name: { type: String },
        email: { type: String },
        password: { type: String },
        otp: { type: Number },
        otpGenerateTime: { type: Number },
        isEmailVerfied: { type: Boolean },
        is2FAEnabel: { type: Boolean },
        base32: { type: String },
      },
      { versionKey: false }
    )
  );
