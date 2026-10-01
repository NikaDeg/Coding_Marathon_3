import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const VehicleRentalPage = ({ isAuthenticated }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const deleteVehicle = async (vehicleId) => {
    try {
      const res = await fetch(`/api/vehicleRentals/${vehicleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error("Failed to delete vehicle: ${errorText}")
      }
      console.log("Vehicle deleted successfully")
      navigate("/")
    } catch (error) {
      console.error("Error deleting vehicle:", error)
    }
  }

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicleRentals/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setVehicle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const onDeleteClick = (vehicleId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this vehicle?"
    )
    if (!confirm) return
    deleteVehicle(vehicleId)
  }

  return (
    <div className="rental-preview">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{vehicle.vehicleModel}</h2>
          <p>Category: {vehicle.category}</p>
          <p>Description: {vehicle.description}</p>
          <br></br>
          <p>Agency Name: {vehicle.agency.name}</p>
          <p>Contact Email: {vehicle.agency.contactEmail}</p>
          <p>Fleet Size: {vehicle.agency.fleetSize}</p>
          <br></br>
          <p>Location: {vehicle.location.city}, {vehicle.location.state}</p>
          <p>Daily Price: ${vehicle.dailyPrice}</p>
          <p>Listing Date: {vehicle.listingDate}</p>
          <p>Availability Status: {vehicle.availabilityStatus}</p>
          <p>Booking Deadline: {vehicle.bookingDeadline}</p>
          <p>Insurance Policy: {vehicle.insurancePolicy}</p>

          {isAuthenticated && (
            <>
              <button onClick={() => navigate(`/edit-vehicle-rentals/${vehicle._id}`)}>Edit</button>
              <button onClick={() => onDeleteClick(vehicle._id)}>Delete</button>
            </>
          )}

        </>
      )}
    </div>
  );
};

export default VehicleRentalPage;

