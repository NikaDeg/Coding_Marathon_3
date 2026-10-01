import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// pages & components
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import AddVehicleRentalPage from "./pages/AddVehicleRentalPage";
import VehicleRentalPage from "./pages/VehicleRentalPage";
import EditVehiclePage from "./pages/EditVehicleRentalPage";
import NotFoundPage from "./pages/NotFoundPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? true : false;
  });
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar 
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/vehicle-rentals/:id"
              element={<VehicleRentalPage isAuthenticated={isAuthenticated}/>}
            />
            <Route 
              path="/add-rental" 
              element={
                isAuthenticated ? <AddVehicleRentalPage /> : <Navigate to="/signup"/> 
              } 
            />

            <Route 
              path="/edit-vehicle-rentals/:id"
              element={
                isAuthenticated ? (
                <EditVehiclePage/>
                ) : (
                  <Navigate to="/signup" />
                )
            }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Signup setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />

            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;

