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
        status: { type: Number },
        borrower_id: { type: String },
        createdAt: { type: Number },
      },
      { versionKey: false, timestamps: false }
    )
  );
