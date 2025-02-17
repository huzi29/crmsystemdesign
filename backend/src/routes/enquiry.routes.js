import express from "express";
import Controllers from "../controllers/index.js";
import middleware from "../middlewares/index.js";

const enquiry = express.Router();

enquiry.post("/add",middleware.VerifyUser, Controllers.EnquiryController.createEnquiry);
enquiry.get("/getall", middleware.VerifyUser,Controllers.EnquiryController.getAllEnquiries);
enquiry.get("/getbyid/:id",middleware.VerifyUser, Controllers.EnquiryController.getEnquiryById)
enquiry.put("/update/:id",middleware.VerifyUser, Controllers.EnquiryController.updateEnquiry);
enquiry.delete("/delete/:id", middleware.VerifyUser,Controllers.EnquiryController.deleteEnquiry);

export default enquiry;
