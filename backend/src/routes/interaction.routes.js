import express from "express";
import Controllers from "../controllers/index.js";
import middleware from "../middlewares/index.js";

const interactions = express.Router();

interactions.post("/add", middleware.VerifyUser,Controllers.InteractionController.createInteraction);
interactions.get("/getall",middleware.VerifyUser, Controllers.InteractionController.getAllInteractions);
interactions.get("/getbyid:id",middleware.VerifyUser, Controllers.InteractionController.getInteractionById)
interactions.put("/update/:id", middleware.VerifyUser,Controllers.InteractionController.updateInteraction)
interactions.delete("/delete/:id",middleware.VerifyUser, Controllers.InteractionController.deleteInteraction)

export default interactions;
