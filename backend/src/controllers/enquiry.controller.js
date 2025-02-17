import db from "../models/index.js"

const createEnquiry = async (req, res) => {
  try {
    const { leadId, propertyInterest, siteVisitDate } = req.body;
    const newEnquiry = await db.EnquiryModel.create({ lead: leadId, propertyInterest, siteVisitDate });
    res.status(201).json(newEnquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnquiries = async (req, res) => {
    try {
      const enquiries = await db.EnquiryModel.find()
        .populate("lead", "name email phone"); 
  
      res.status(200).json(enquiries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getEnquiryById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const enquiry = await db.EnquiryModel.findById(id)
        .populate("lead", "name email phone");
  
      if (!enquiry) {
        return res.status(404).json({ message: "Enquiry not found" });
      }
  
      res.status(200).json(enquiry);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const updateEnquiry = async (req, res) => {
    try {
      const { id } = req.params;
      const { propertyInterest, siteVisitDate,status } = req.body;
  
      const updatedEnquiry = await db.EnquiryModel.findByIdAndUpdate(
        id,
        { propertyInterest, siteVisitDate,status },
        { new: true, runValidators: true } 
      ).populate("lead", "name email phone");
  
      if (!updatedEnquiry) {
        return res.status(404).json({ message: "Enquiry not found" });
      }
  
      res.status(200).json(updatedEnquiry);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const deleteEnquiry = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedEnquiry = await db.EnquiryModel.findByIdAndDelete(id);
  
      if (!deletedEnquiry) {
        return res.status(404).json({ message: "Enquiry not found" });
      }
  
      res.status(200).json({ message: "Enquiry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const EnquiryController = {
    createEnquiry, getAllEnquiries, getEnquiryById, updateEnquiry, deleteEnquiry
}

export default EnquiryController;