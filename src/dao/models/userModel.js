import mongoose from "mongoose";

const usersCollection = "users";
const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    password: String,
    last_connection: Date,
    role: {
      type: String,
      default: "user",
    },
    loginStrategy: {
      type: String,
      default: "jwt"
    }
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const userModel = mongoose.model(usersCollection, usersSchema);
