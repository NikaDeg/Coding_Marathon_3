import VehicleRentalListing from "./VehicleRentalListing";

const VehicleRentalListings = ({ vehicles }) => {
  return (
    <div className="rental-list">
      {vehicles.map((v) => (
        <VehicleRentalListing key={v._id} vehicle={v}/>
      ))}
    </div>
  );
};

export default VehicleRentalListings;

