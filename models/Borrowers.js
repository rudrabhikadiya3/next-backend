import mongoose, { Schema } from "mongoose";
module.exports =
  mongoose.models.Borrowers ||
  mongoose.model(
    "Borrowers",
    new Schema(
      {
        borrower_id: { type: String },
        borrowAmount: { type: Number },
        leftAmount: { type: Number },
        intrest: { type: Number },
        duration: { type: Number },
        files: { type: Array },
        status: { type: Number },
        createdAt: { type: Number },
      },
      { versionKey: false, timestamps: false }
    )
  );
