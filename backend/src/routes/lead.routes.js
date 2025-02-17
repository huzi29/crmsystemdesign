import express from "express";
import Controllers from "../controllers/index.js";
import middleware from "../middlewares/index.js";

const leads = express.Router();

leads.post("/add", middleware.VerifyUser, Controllers.LeadController.createLead);
leads.get("/getall", middleware.VerifyUser, Controllers.LeadController.getAllLeads);
leads.get("/getbyid/:id", middleware.VerifyUser, Controllers.LeadController.getLeadById);
leads.put("/update/:id", middleware.VerifyUser, Controllers.LeadController.updateLead);
leads.delete("/delete/:id", middleware.VerifyUser, Controllers.LeadController.deleteLead);

export default leads;

 