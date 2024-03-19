import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    serviceDate: {
      type: Date,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "CUSTOMER_CANCELED",
        "PROFESSIONAL_CANCELLED",
      ],
      default: "PENDING",
    },
    note: {
      type: String,
      default: null,
    },
    customerId: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    serviceId: {
      type: mongoose.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    collectedAmount: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
