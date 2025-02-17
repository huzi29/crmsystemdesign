import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Router from "./src/routes/index.js";

// load environment variables
dotenv.config();

const app = express();

// middlewares
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend access
app.use(express.json());


// routes
app.use("/api/v1/auth", Router.AuthRouter);
app.use("/api/v1/leads", Router.LeadRouter);
app.use("/api/v1/interaction", Router.InteractionRouter);
app.use("/api/v1/enquiry", Router.EnquiryRouter);
app.use("/api/v1/booking", Router.BookingRouter);


app.get("/", (req, res) => {
  res.send("Welcome to CRMSystemDesign API !!!");
});
export default app;
