import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    required: [true, "Please provide a name for this pet."],
  },
});
export default mongoose.models.User || mongoose.model("User", UserSchema);
