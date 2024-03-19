import mongoose, { Schema } from "mongoose";

const professionalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    skill: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Professional =
  mongoose.models.Professional ||
  mongoose.model("Professional", professionalSchema);
export default Professional;
