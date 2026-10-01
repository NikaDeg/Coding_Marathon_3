const express = require('express');
const router = express.Router();
const {
  getAllVehicleRentals,
  createVehicleRental,
  getVehicleRentalById,
  updateVehicleRental,
  deleteVehicleRental,
} = require('../controllers/vehicleRentalControllers');

// GET /api/vehicleRentals
router.get('/', getAllVehicleRentals);

// POST /api/vehicleRentals
router.post('/', createVehicleRental);

// GET /api/vehicleRentals/:vehicleRentalId
router.get('/:vehicleId', getVehicleRentalById);

// PUT /api/vehicleRentals/:vehicleRentalId
router.put('/:vehicleId', updateVehicleRental);

// DELETE /api/vehicleRentals/:vehicleRentalId
router.delete('/:vehicleId', deleteVehicleRental);

module.exports = router;

