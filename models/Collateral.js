import mongoose, { Schema } from "mongoose";
module.exports =
  mongoose.models.Collateral ||
  mongoose.model(
    "Collateral",
    new Schema(
      {
        owner_id: { type: String },
        child_owner_id: { type: String },
        borrow_id: { type: String },
        files: { type: Array },
        status: { type: Number },
        createdAt: { type: Number },
      },
      { versionKey: false, timestamps: false }
    )
  );
