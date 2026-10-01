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
const path = require("path")

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

connectDB();
// Routes
app.use("/api/vehicleRentals", vehicleRentalRouter);
//app.use("/api/users", userRouter)
app.use(express.static(path.join(__dirname, "view")));
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "view", "index.html"));
});

// Error handling
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
