require('dotenv').config(); // This will load the .env variables

const express = require('express');
const path = require('path');
const cors = require("cors");
const mongoose = require('mongoose');
const bookingRoutes = require('./routes/booking');
const slotRouting = require('./routes/slots');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("MongoDB connection error: ", err);
});

app.use('/api/bookings', bookingRoutes);
app.use('/api/slots', slotRouting);

app.get("/", (req, res) => {
  const htmlFile = path.join(__dirname, 'index.html');
  res.sendFile(htmlFile);
})

app.listen(port, () => console.log(`Server running on port ${port}`));
