import express from "express";
import pkg from "body-parser";
const { json } = pkg;
import { connect, Schema, model } from "mongoose";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Connect to MongoDB
connect(
  "mongodb+srv://nailshadezdotcom:uCOqaUpJMzQI0iP3@bookingdata.a90zrkp.mongodb.net/?retryWrites=true&w=majority&appName=bookingData"
)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Define Booking Schema
const bookingSchema = new Schema({
  name: String,
  mobile: String,
  email: String,
  service: String,
  date: String,
  time: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Booking = model("Booking", bookingSchema);

// Endpoint to create a booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { name, mobile, email, service, date, time } = req.body;
    // (Optional) Validate that the time is between 10:00 and 19:00 on the server side.
    const newBooking = new Booking({
      name,
      mobile,
      email,
      service,
      date,
      time,
    });
    await newBooking.save();
    res.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

// Endpoint for internal dashboard to retrieve bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Endpoint for internal dashboard to update booking status
app.patch("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Booking.findByIdAndUpdate(id, { status });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

//some contact page having name,email,phno,message
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phno, message } = req.body;
    const newContact = new Contact({
      name,
      email,
      phno,
      message,
    });
    await newContact.save();
    res.json({ success: true, contact: newContact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save contact" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
