const VehicleRentalListing = ({ vehicle }) => {
  return (
    <div className="rental-preview">
    <Link to="/vehicle-rentals/:id">
      <h2>Vehicle Model: {vehicle.vehicleModel}</h2>
    </Link>
      <p>Category: {vehicle.category}</p>
      <p>Daily Price: ${vehicle.dailyPrice}</p>
      <p>Status: {vehicle.availabilityStatus}</p>
    </div>
  );
};

export default VehicleRentalListing;

