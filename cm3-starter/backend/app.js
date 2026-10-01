const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const {
  unknownEndpoint,
  errorHandler,
  requestLogger,
} = require("./middleware/customMiddleware");
require("dotenv").config();
const vehicleRentalRouter = require("./routes/vehicleRentalRouter");
const userRouter = require("./routes/userRouter");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

connectDB();

// Routes
app.use("/api/vehicleRentals", vehicleRentalRouter);
app.use("/api/users", userRouter);

app.use(express.static("view")); // Serve static files from 'view'

// Error handling
app.use(unknownEndpoint);
app.use(errorHandler);

app.use((req, res) => {
  res.sendFile(__dirname + "/view/index.html");
});

module.exports = app;
