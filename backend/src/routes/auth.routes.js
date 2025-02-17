import express from "express";
import authController from "../Auth/auth.controller.js";
import middleware from "../middlewares/index.js";

const auth = express.Router();

auth.post("/register", authController.registerUser);
auth.post("/login", authController.loginUser);
auth.post("/logout", authController.logoutUser);
auth.get("/refresh/:token", authController.getRefreshToken);
auth.get("/users", middleware.VerifyUser, authController.getAllUsers);
auth.get("/token", authController.getAllToken);
auth.get("/delete/:id", middleware.VerifyUser, authController.deleteUser);

export default auth;
