import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddVehicleRentalPage = () => {
  const [vehicleModel, setVehicleModel] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [agencyName, setAgencyName] = useState("");
  const [agencyEmail, setAgencyEmail] = useState("");
  const [fleetSize, setFleetSize] = useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [dailyPrice, setDailyPrice] = useState("");
  const [listingDate, setListingDate] = useState("");

  const [availabilityStatus, setAvailabilityStatus] = useState('available');
  const [bookingDeadline, setBookingDeadline] = useState("");
  const [insurancePolicy, setInsurancePolicy] = useState("");

  const navigate = useNavigate();

  const addVehicle = async (newVehicle) => {
    try {
      const res = await fetch("/api/vehicleRentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVehicle),
      });
      if (!res.ok) {
        throw new Error("Failed to add vehicle");
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const newVehicle = {
      vehicleModel,
      category,
      description,
      agency: {
        name: agencyName,
        contactEmail: agencyEmail,
        fleetSize,
      },

      location: {
        city,
        state,
      },
      dailyPrice,
      listingDate,
      availabilityStatus,
      bookingDeadline,
      insurancePolicy,
    };

    const success = await addVehicle(newVehicle);
     if (success) {
      console.log("Vehicle Added Successfully");
      navigate("/");
    } else {
      console.error("Failed to add the vehicle");
    }

  }

  return (
    <div className="create">
      <h2>Add a New Vehicle Rental</h2>
      <form onSubmit={submitForm}>
        <label>Vehicle Model:</label>
        <input 
          type="text" 
          required
          value={vehicleModel}
          onChange={(e) => setVehicleModel(e.target.value)}
        />
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value ="" disabled>Select category</option>
          <option value="Economy">Economy</option>
          <option value="Luxury">Luxury</option>
          <option value="SUV">SUV</option>
          <option value="Van">Van</option>
          <option value="Truck">Truck</option>
        </select>

        <label>Description:</label>
        <textarea 
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label>Agency Name:</label>
        <input 
          type="text" 
          required
          value={agencyName}
          onChange={(e) => setAgencyName(e.target.value)}
        />

        <label>Agency Email:</label>
        <input 
          type="email" 
          required
          value={agencyEmail}
          onChange={(e) => setAgencyEmail(e.target.value)}
        />

        <label>Fleet Size:</label>
        <input 
          type="number" 
          min="0"
          value={fleetSize}
          onChange={(e) => setFleetSize(e.target.value)}
        />

        <label>City:</label>
        <input 
          type="text" 
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <label>State:</label>
        <input 
          type="text" 
          required
          value={state}
          onChange={(e) => setState(e.target.value)}
        />

        <label>Daily Price:</label>
        <input 
          type="number" 
          step="0.01" 
          min="0" 
          required
          value={dailyPrice}
          onChange={(e) => setDailyPrice(e.target.value)}
        />

        <label>Availability Status:</label>
        <select 
          value={availabilityStatus} 
          onChange={(e) => setAvailabilityStatus(e.target.value)}
        >
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <label>Booking Deadline:</label>
        <input 
          type="date"
          value={bookingDeadline}
          onChange={(e) => setBookingDeadline(e.target.value)}
        />

        <label>Insurance Policy:</label>
        <input 
          type="text" 
          required 
          value={insurancePolicy}
          onChange={(e) => setInsurancePolicy(e.target.value)}
        />

        <button onClick={() => navigate("/")}>Add Vehicle Rental</button>
      </form>
    </div>
  );
};

export default AddVehicleRentalPage;

