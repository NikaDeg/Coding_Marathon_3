import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import AddVehicleRentalPage from "./pages/AddVehicleRentalPage";
import VehicleRentalPage from "./pages/VehicleRentalPage";
import EditVehiclePage from "./pages/EditVehicleRentalPage";
import NotFoundPage from "./pages/NotFoundPage";


const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/vehicle-rentals/:id"
              element={<VehicleRentalPage/>}
            />
            <Route 
              path="/add-rental" 
              element={<AddVehicleRentalPage />} 
            />

            <Route 
              path="/edit-vehicle-rentals/:id"
              element={<EditVehiclePage/>}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;

