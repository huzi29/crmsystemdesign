import db from "../models/index.js";

const createBooking = async (req, res) => {
  try {
    const { leadId, property, tokenAmount, handledBy } = req.body;
    const newBooking = await db.BookingModel.create({ 
      lead: leadId, 
      property, 
      tokenAmount, 
      handledBy 
    });
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await db.BookingModel.find()
    .populate({
        path: "lead",
        select: "name email phone",
        strictPopulate: false, 
      })
    .populate("handledBy", "name email role") 
      .sort({ createdAt: -1 }); 
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const booking = await db.BookingModel.findById(id)
        .populate("lead", "name email phone")
        .populate("handledBy", "name email role");
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const updateBooking = async (req, res) => {
    try {
      const { id } = req.params;
      const { property, tokenAmount,bookingDate,status } = req.body;
  
      const updatedBooking = await db.BookingModel.findByIdAndUpdate(
        id,
        { property, tokenAmount,bookingDate,status },
        { new: true, runValidators: true } 
      )
        .populate("lead", "name email phone")
        .populate("handledBy", "name email role");
  
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      res.status(200).json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const deleteBooking = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedBooking = await db.BookingModel.findByIdAndDelete(id);
  
      if (!deletedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

const BookingController = {
    createBooking,
    getAllBookings, 
    getBookingById,
    updateBooking,
    deleteBooking,
 };

export default BookingController;
