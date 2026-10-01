const express = require('express');
const router = express.Router();
const {
  getAllVehicleRentals,
  createVehicleRental,
  getVehicleRentalById,
  updateVehicleRental,
  deleteVehicleRental,
} = require('../controllers/vehicleRentalControllers');

const requireAuth = require("../middleware/requireAuth");

// public:
// GET /api/vehicleRentals
router.get('/', getAllVehicleRentals);
// GET /api/vehicleRentals/:vehicleRentalId
router.get('/:vehicleId', getVehicleRentalById);


//middleware to protect routes:
router.use(requireAuth);

// POST /api/vehicleRentals
router.post('/', createVehicleRental);
// PUT /api/vehicleRentals/:vehicleRentalId
router.put('/:vehicleId', updateVehicleRental);
// DELETE /api/vehicleRentals/:vehicleRentalId
router.delete('/:vehicleId', deleteVehicleRental);

module.exports = router;

