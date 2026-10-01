const VehicleRental = require('../models/vehicleRentalModel');
const mongoose = require('mongoose');

// GET /api/vehicleRentals
const getAllVehicleRentals = async (req, res) => {
  try {
        const vehicles = await VehicleRental.find({});
        res.status(200).json(vehicles);
  } catch (error) {
        res.status(500).json({ message: "Failed to retrieve vehicles" });
  }
};

// POST /api/vehicleRentals
const createVehicleRental = async (req, res) => {
  try {
    const user_id = req.user._id;
    const newVehicle = new VehicleRental({...req.body, user_id});
    await newVehicle.save();
    res.status(201).json(newVehicle);

    } catch (error) {
        console.error("Error creating vehicle:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// GET /api/vehicleRentals/:vehicleRentalId
const getVehicleRentalById = async (req, res) => {
  const { vehicleId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
          return res.status(400).json({ message: "Invalid vehicle ID" });
      }

      try {
          const vehicle = await VehicleRental.findById(vehicleId);
          const limit = parseInt(req.query._limit);
          const vehicles = limit 
              ? await VehicleRental.find({}).sort({ createdAt: -1 }).limit(limit)
              : await VehicleRental.find({}).sort({ createdAt: -1 });
          if (vehicle) {
              res.status(200).json(vehicle);
          } else {
              res.status(404).json({message: "Vehicle is not found"});
          }
      } catch (error) {
          res.status(500).json({ message: "Failed to retrieve a vehicle" });
      }
};

// PUT /api/vehicleRentals/:vehicleRentalId
const updateVehicleRental = async (req, res) => {
  // res.send("updateVehicleRental");
        const { vehicleId } = req.params;
        const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        return res.status(400).json({ message: "Invalid vehicle ID" });
    }
    try {
        const updatedVehicle = await VehicleRental.findOneAndUpdate(
            { _id: vehicleId, user_id },
            { ...req.body},
            { returnDocument: "after" },
        );
        if (updatedVehicle) {
            res.status(200).json(updatedVehicle);
        } else {
            res.status(404).json({ message: "Vehicle not found" });
        }

    } catch (error) {
        res.status(500).json({ message: "Failed to update a vehicle" });
    }
};

// DELETE /api/vehicleRentals/:vehicleRentalId
const deleteVehicleRental = async (req, res) => {
  // res.send("deleteVehicleRental");
  const { vehicleId } = req.params;
  const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    try {
        const deleteVehicle = await VehicleRental.findOneAndDelete({_id: vehicleId, user_id});
        if (deleteVehicle){
            res.status(204).send();
        } else {
            res.status(404).json({message: "Vehicle not found"});
        }
    } catch {
        res.status(500).json({ message: "Failed to delete a vehicle" });
    }
};

module.exports = {
  getAllVehicleRentals,
  createVehicleRental,
  getVehicleRentalById,
  updateVehicleRental,
  deleteVehicleRental,
};

