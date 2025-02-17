import express from "express";
import Controllers from "../controllers/index.js";
import middleware from "../middlewares/index.js";


const booking = express.Router();

booking.post("/add", middleware.VerifyUser,Controllers.BookingController.createBooking);
booking.get("/getall", middleware.VerifyUser,Controllers.BookingController.getAllBookings);
booking.get("/getbyid/:id",middleware.VerifyUser, Controllers.BookingController.getBookingById)
booking.put("/update/:id",middleware.VerifyUser, Controllers.BookingController.updateBooking);
booking.delete("/delete/:id", middleware.VerifyUser,Controllers.BookingController.deleteBooking);

export default booking;
