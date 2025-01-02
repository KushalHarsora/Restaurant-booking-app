const express = require('express');
const router = express.Router();
const { Booking, Slot } = require("../model/userModel");

router.post("/", async (req, res) => {
  // Use the correct field names from frontend
  const { name, email, phone, date, guests, time } = req.body;
  console.log('Received payload:', req.body);

  try {
    // Check for slot availability
    let slot = await Slot.findOne({ date });
    if (!slot) {
      console.log('No slot found, creating new slot.');
      slot = new Slot({ date, availableSlots: 50 });
    }

    // Check if there are enough available slots
    if (slot.availableSlots < guests) {
      return res.status(400).send(`Not enough slots available. Only ${slot.availableSlots} slots remaining.`);
    }

    // Ensure that time is provided, or set a default
    if (!time) {
      return res.status(400).send("Time is required for booking.");
    }

    // Create booking
    const booking = new Booking({ name, email, phone, date, time, guests });
    const savedBooking = await booking.save();
    console.log('Booking saved:', savedBooking);

    // Update available slots
    slot.availableSlots -= guests;
    console.log('Updated available slots:', slot.availableSlots);
    await slot.save();

    res.status(201).send({ message: "Booking confirmed", booking: savedBooking });
  } catch (err) {
    console.error('Error while creating booking:', err);
    res.status(500).send({ message: "Error creating booking", error: err.message });
  }
});

module.exports = router;
