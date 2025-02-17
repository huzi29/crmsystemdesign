import db from "../models/index.js"

const createInteraction = async (req, res) => {
  try {
    const { leadId, notes, interactionType, handledBy } = req.body;

    const newInteraction = await db.InteractionModel.create({
      lead: leadId,
      notes,
      interactionType,
      handledBy
    });

    await db.LeadModel.findByIdAndUpdate(
      leadId,
      { $push: { interactions: newInteraction._id } }, 
      { new: true, runValidators: true }
    );

    res.status(201).json(newInteraction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getAllInteractions = async (req, res) => {
    try {
      const interactions = await db.InteractionModel.find()
        .populate("lead", "name email phone") 
        .populate("handledBy", "name email roles"); 
  
      res.status(200).json(interactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getInteractionById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const interaction = await db.InteractionModel.findById(id)
        .populate("lead", "name email phone")
        .populate("handledBy", "name email roles");
  
      if (!interaction) {
        return res.status(404).json({ message: "Interaction not found" });
      }
  
      res.status(200).json(interaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  const updateInteraction = async (req, res) => {
    try {
      const { id } = req.params;
      const { notes, interactionType, handledBy } = req.body;
  
      const updatedInteraction = await db.InteractionModel.findByIdAndUpdate(
        id,
        { notes, interactionType, handledBy },
        { new: true, runValidators: true } 
      )
        .populate("lead", "name email phone")
        .populate("handledBy", "name email roles");
  
      if (!updatedInteraction) {
        return res.status(404).json({ message: "Interaction not found" });
      }
  
      res.status(200).json(updatedInteraction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const deleteInteraction = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedInteraction = await db.InteractionModel.findByIdAndDelete(id);
  
      if (!deletedInteraction) {
        return res.status(404).json({ message: "Interaction not found" });
      }
  
      res.status(200).json({ message: "Interaction deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


const InteractionController = {
    createInteraction,getAllInteractions, getInteractionById, updateInteraction, deleteInteraction
}

export default InteractionController;