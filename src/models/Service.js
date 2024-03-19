import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["CARE", "WASH"],
      required: true,
    },
    professionalId: {
      type: mongoose.Types.ObjectId,
      ref: "Professional",
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  { timestamps: true }
);

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);
export default Service;
