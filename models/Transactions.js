import mongoose, { Schema } from "mongoose";
module.exports =
  mongoose.models.Transactions ||
  mongoose.model(
    "Transactions",
    new Schema(
      {
        user_id: { type: String },
        from_id: { type: String },
        type: { type: Number },
        amount: { type: Number },
        transactedAt: { type: Number },
      },
      { versionKey: false }
    )
  );
