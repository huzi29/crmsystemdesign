import mongoose from "mongoose";

const InteractionSchema = new mongoose.Schema({
  lead: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Lead", 
    required: true 
  },
  notes: { 
    type: String, 
    required: true 
  },
  interactionType: { 
    type: String, 
    enum: ["Call", "Email", "Meeting", "Site Visit"], 
    required: true 
  },
  handledBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  }
}, { timestamps: true });

export default mongoose.model("Interaction", InteractionSchema);
