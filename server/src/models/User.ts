import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    picture: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      default: "google",
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);