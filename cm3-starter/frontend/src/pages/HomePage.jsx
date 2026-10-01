import { useEffect, useState } from "react";
import VehicleRentalListings from "../components/VehicleRentalListings";

const Home = () => {

  const [vehicles, setVehicles] = useState(null)
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(`/api/vehicleRentals`)
        if (!res.ok) {
          throw new Error("couldn't fetch vehicle data")
        }
        const data = await res.json()
        setIsPending(false)
        setVehicles(data)
        setError(null)
      } catch (err) {
        setIsPending(false)
        setError(err.message)
      }
    }
    fetchVehicles()
  }, [])

  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {vehicles && <VehicleRentalListings vehicles={vehicles}/>}
    </div>
  );
};

export default Home;

