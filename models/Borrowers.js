import mongoose, { Schema } from "mongoose";
module.exports =
  mongoose.models.Borrowers ||
  mongoose.model(
    "Borrowers",
    new Schema(
      {
        name: { type: String },
        borrowAmount: { type: String },
        duration: { type: Number },
        intrest: { type: Number },
        files: { type: Array },
        approved: { type: Boolean },
        user_id: { type: String },
      },
      { versionKey: false, timestamps: true }
    )
  );
