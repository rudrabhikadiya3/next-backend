import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
export default mongoose.models.User || mongoose.model("User", UserSchema);

// import mongoose, { Schema } from "mongoose";
// module.exports =
//   mongoose.models.Activities ||
//   mongoose.model(
//     "Activities",
//     new mongoose.Schema(
//       {
//         userId: { type: String, require: true, ref: "User" },
//         name: { type: String, require: true },
//         alias: { type: String, require: true },
//         table: { type: String, require: true },
//         oldValue: { type: Schema.Types.Mixed, default: "" },
//         newValue: { type: Schema.Types.Mixed, default: "" },
//         createdOn: { type: Number },
//       },
//       { versionKey: false }
//     )
//   );
