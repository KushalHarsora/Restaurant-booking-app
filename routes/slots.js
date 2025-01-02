const express = require("express");
const { Slot } = require("../model/userModel");

const router = express.Router();

// Get available slots for a date
router.get("/:date", async (req, res) => {
  const { date } = req.params;
  try {
    let slot = await Slot.findOne({ date });

    // If no entry exists for the date then just set 50 slots as default
    if (!slot) {
      slot = new Slot({ date, availableSlots: 50 });
      await slot.save();
    }

    res.status(200).send({ availableSlots: slot.availableSlots });
  } catch (err) {
    res.status(500).send({ message: "Error fetching available slots", error: err.message });
  }
});

module.exports = router;
