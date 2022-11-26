import mongoose, { Schema } from "mongoose";
module.exports =
  mongoose.models.Users ||
  mongoose.model(
    "Users",
    new Schema(
      {
        name: { type: String },
        email: { type: String },
        balance: { type: Number },
        admin: { type: Boolean },
        isEmailVerfied: { type: Boolean },
        otp: { type: Number },
        otpGenerateTime: { type: Number },
        is2FAEnabel: { type: Boolean },
        base32: { type: String },
        password: { type: String },
      },
      { versionKey: false }
    )
  );
