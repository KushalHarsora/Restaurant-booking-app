const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
});

const slotSchema = new mongoose.Schema({
  date: { type: String, unique: true, required: true },
  availableSlots: { type: Number, default: 50 },
});

const Booking = mongoose.model("Booking", bookingSchema);
const Slot = mongoose.model("Slot", slotSchema);

module.exports = { Booking, Slot };
