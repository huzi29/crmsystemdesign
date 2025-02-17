import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    propertyInterest: { type: String, required: true },
    siteVisitDate: { type: Date },
    status: {
      type: String,
      enum: ["Scheduled", "Completed"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", EnquirySchema);
