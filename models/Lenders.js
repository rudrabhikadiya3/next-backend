import mongoose, { Schema } from "mongoose";
module.exports =
  mongoose.models.Lenders ||
  mongoose.model(
    "Lenders",
    new Schema(
      {
        borrower_id: { type: String },
        lender_id: { type: String },
        alloted: { type: Number },
        loan_amount: { type: Number },
        duration: { type: Number },
        intrest: { type: Number },
        status: { type: Number },
        ApprovedAt: { type: Number },
      },
      { versionKey: false, timestamps: false }
    )
  );
