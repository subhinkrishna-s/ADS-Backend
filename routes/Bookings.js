const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const isAdmin = require("../middlewares/CheckAdmin")

// API for placing a new booking
router.post("/place-booking", async (req, res) => {
  try {
    const { customerName, contact, email, address, startDate, endDate, serviceId } = req.body;
    
    if (!customerName || !email || !contact || !address || !startDate || !endDate || !serviceId) {
      return res.send({ success: false, message: "Please provide all details!" });
    }
    
    const bookings = await Booking.find({});
    let id = bookings.length > 0 ? bookings.slice(-1)[0].id + 1 : 1;
    if (!id) {
        return res.send({ success: false, message: "Failed to generate ID, please contact developer!" });
    }

    const newBooking = new Booking({ id, customerName, contact, email, address, startDate, endDate, serviceId });
    await newBooking.save();

    return res.send({ success: true, message: "Booking placed successfully" });
  } catch (err) {
    console.log("Error in Placing Booking:", err);
    return res.send({ success: false, message: "Trouble in placing booking, Please contact developer!" });
  }
});

// API for fetching all bookings
router.get("/fetch-bookings", isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({});
    return res.send({ success: true, message: "Successfully fetched all bookings", bookings: bookings });
  } catch (err) {
    console.log("Error in Fetching Bookings:", err);
    return res.send({ success: false, message: "Trouble in fetching bookings, Please contact developer!" });
  }
});

// API for fetching a single booking by ID
router.get("/fetch-booking/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.send({ success: false, message: "Please provide a valid parameter in API Endpoint!" });
    }

    const booking = await Booking.findOne({ id });
    if (!booking) {
      return res.send({ success: false, message: "Booking not found" });
    }

    return res.send({ success: true, message: "Successfully fetched booking!", booking: booking });
  } catch (err) {
    console.log("Error in Fetching Booking:", err);
    return res.send({ success: false, message: "Trouble in fetching booking, Please contact developer!" });
  }
});

// API for updating the status of a booking by ID
router.post("/update-booking/:id", isAdmin, async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;
    
    if (!id || !status || id === 'undefined') {
      return res.send({ success: false, message: "Please provide a valid ID and status!" });
    }
    
    const updatedBooking = await Booking.updateOne(
      { id },
      { $set: { status } }
    );

    if (!updatedBooking) {
      return res.send({ success: false, message: "Failed to update booking status!" });
    }
    
    return res.send({ success: true, message: "Booking status updated successfully" });
  } catch (err) {
    console.log("Error in Updating Booking Status:", err);
    return res.send({ success: false, message: "Trouble in updating booking status, Please contact developer!" });
  }
});

// API for deleting a booking by ID
router.get("/delete-booking/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.send({ success: false, message: "Please provide a valid parameter in API Endpoint!" });
    }

    const deletedBooking = await Booking.deleteOne({ id });
    if (!deletedBooking) {
      return res.send({ success: false, message: "Failed to delete booking!" });
    }
    
    return res.send({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    console.log("Error in Deleting Booking:", err);
    return res.send({ success: false, message: "Trouble in deleting booking, Please contact developer!" });
  }
});

module.exports = router;
