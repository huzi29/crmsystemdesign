import db from "../models/index.js";

const createLead = async (req, res) => {
  try {
    const { name, email, phone, source } = req.body;
    const newLead = await db.LeadModel.create({ name, email, phone, source });
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllLeads = async (req, res) => {
  try {
    const leads = await db.LeadModel.find()
      .populate({
        path: "interactions",
        populate: {
          path: "handledBy",
          select: "name email"
        }
      })
      .populate("enquiry");

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await db.LeadModel.findById(id)
      .populate({
        path: "interactions",
        populate: {
          path: "handledBy",
          select: "name email"
        }
      })
      .populate("enquiry");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLead = async (req, res) => {
    try {
      const { id } = req.params; 
      const { name, email, phone, source, status } = req.body;
  
      const updatedLead = await db.LeadModel.findByIdAndUpdate(
        id,
        { name, email, phone, source, status },
        { new: true, runValidators: true } 
      );
  
      if (!updatedLead) {
        return res.status(404).json({ message: "Lead not found" });
      }
  
      res.status(200).json(updatedLead);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const deleteLead = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedLead = await db.LeadModel.findByIdAndDelete(id);
  
      if (!deletedLead) {
        return res.status(404).json({ message: "Lead not found" });
      }
  
      res.status(200).json({ message: "Lead deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const LeadController = { createLead , getAllLeads, getLeadById,updateLead, deleteLead }

export default LeadController;