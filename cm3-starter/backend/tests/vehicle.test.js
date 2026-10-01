const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Vehicle = require("../models/vehicleRentalModel");

const vehicles = [
  {
    vehicleModel: "Tesla",
    category: "electric",
    description: "red",
    agency: { name: "Red", contactEmail: "tesla@gmail.com", fleetSize: 2 },
    location: { city: "Espoo", state: "Uusimaa" },
    dailyPrice: 10000,
    listingDate: "01.10.26",
    availabilityStatus: "available",
    bookingDeadline: "10.10.26",
    insurancePolicy: "yes",
  },
  {
    vehicleModel: "Toyota",
    category: "diesel",
    description: "white",
    agency: { name: "White", contactEmail: "toyota@gmail.com", fleetSize: 2 },
    location: { city: "Helsinki", state: "Uusimaa" },
    dailyPrice: 8000,
    listingDate: "01.10.26",
    availabilityStatus: "available",
    bookingDeadline: "10.10.26",
    insurancePolicy: "yes",
  },
];

beforeEach(async () => {
  await Vehicle.deleteMany({});
  await Vehicle.insertMany(vehicles);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Vehicle Controller", () => {
  // get /api/vehicleRentals

  it("should return all vehicles", async () => {
    const response = await api.get("/api/vehicleRentals").expect(200);

    expect(response.body).toHaveLength(vehicles.length);
  });

  it("should return all vehicles as JSON when GET /api/vehicleRentals is called", async () => {
    const response = await api
      .get("/api/vehicleRentals")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(vehicles.length);
  });

  it("should include a specific vehicle in the returned list", async () => {
    const response = await api.get("/api/vehicleRentals");

    expect(response.body.map((vehicle) => vehicle.category)).toContain(
      "electric",
    );
  });

  // Test POST /api/vehicleRentals

  it("should create a new vehicle when POST /api/vehicleRentals is called", async () => {
    const newVehicle = {
      vehicleModel: "Tesla",
      category: "electric",
      description: "red",
      agency: { name: "Red", contactEmail: "tesla@gmail.com", fleetSize: 2 },
      location: { city: "Espoo", state: "Uusimaa" },
      dailyPrice: 10000,
      listingDate: "01.10.26",
      availabilityStatus: "available",
      bookingDeadline: "10.10.26",
      insurancePolicy: "yes",
    };

    await api
      .post("/api/vehicleRentals")
      .send(newVehicle)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const vehiclesAfterPost = await Vehicle.find({});
    expect(vehiclesAfterPost).toHaveLength(vehicles.length + 1);
    const vehicleName = vehiclesAfterPost.map(
      (vehicle) => vehicle.vehicleModel,
    );
    expect(vehicleName).toContain(newVehicle.vehicleModel);
  });

  it("should return status 400 when vehicleName is missing", async () => {
    const invalidVehicle = {
      category: "electric",
      description: "red",
      agency: { name: "Red", contactEmail: "tesla@gmail.com", fleetSize: 2 },
      location: { city: "Espoo", state: "Uusimaa" },
      dailyPrice: 10000,
      listingDate: "01.10.26",
      availabilityStatus: "available",
      bookingDeadline: "10.10.26",
      insurancePolicy: "yes",
    };

    await api.post("/api/vehicleRentals").send(invalidVehicle).expect(400);
  });

  it("should not increase the number of vehicles in the database", async () => {
    const invalidVehicle = {
      category: "electric",
      description: "red",
      agency: { name: "Red", contactEmail: "tesla@gmail.com", fleetSize: 2 },
      location: { city: "Espoo", state: "Uusimaa" },
      dailyPrice: 10000,
      listingDate: "01.10.26",
      availabilityStatus: "available",
      bookingDeadline: "10.10.26",
      insurancePolicy: "yes",
    };
    await api.post("/api/vehicleRentals").send(invalidVehicle).expect(400);

    const vehiclesAtEnd = await Vehicle.find({});
    expect(vehiclesAtEnd).toHaveLength(vehicles.length);
  });

  // Test GET /api/vehicleRentals/:id

  it("should return one vehicle by ID when GET /api/vehicleRentals/:id is called", async () => {
    const vehicle = await Vehicle.findOne();
    await api
      .get(`/api/vehicleRentals/${vehicle._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 404 for a non-existing vehicle ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/vehicleRentals/${nonExistentId}`).expect(404);
  });

  it("should return status 400 when id is invalid", async () => {
    await api.get("/api/vehicleRentals/12345").expect(400);
  });

  // Test PUT /api/vehicleRentals:id

  it("should update one vehicle with partial data when PUT /api/vehicleRentals:id is called", async () => {
    const vehicle = await Vehicle.findOne();
    const updatedVehicle = {
      category: "UPDATED",
      description: "UPDATED",
    };

    await api
      .put(`/api/vehicleRentals/${vehicle._id}`)
      .send(updatedVehicle)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedVehicleCheck = await Vehicle.findById(vehicle._id);
    expect(updatedVehicleCheck.description).toBe(updatedVehicle.description);
    expect(updatedVehicleCheck.category).toBe(updatedVehicle.type);
  });

  it("should return 400 for invalid vehicle ID when PUT /api/vehicleRentals:id", async () => {
    const invalidId = "12345";
    await api.put(`/api/vehicleRentals/${invalidId}`).send({}).expect(400);
  });

  it("should return status 400", async () => {
    await api.put("/api/vehicleRentals/12345").send({}).expect(400);
  });

  // Test DELETE /api/vehicleRentals/:id
  it("should delete one vehicle by ID when DELETE /api/vehicleRentals/:id is called", async () => {
    const vehicle = await Vehicle.findOne();
    await api.delete(`/api/vehicleRentals/${vehicle._id}`).expect(204);

    const deletedVehicleCheck = await Vehicle.findById(vehicle._id);
    expect(deletedVehicleCheck).toBeNull();
  });

  it("should return 400 for invalid vehicle ID when DELETE /api/vehicleRentals/:id", async () => {
    const invalidId = "12345";
    await api.delete(`/api/vehicleRentals/${invalidId}`).expect(400);
  });
});
