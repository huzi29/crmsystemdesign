import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
  property: { type: String, required: true },
  tokenAmount: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
},
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
