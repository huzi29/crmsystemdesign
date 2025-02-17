import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    source: {
      type: String,
      enum: ["Website", "LinkedIn", "Facebook", "Instagram", "Other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Interested", "Converted", "Lost"],
      default: "New",
    },
    interactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Interaction" },
    ],
    enquiry: { type: mongoose.Schema.Types.ObjectId, ref: "Enquiry" },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", LeadSchema);
