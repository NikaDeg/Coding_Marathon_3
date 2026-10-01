const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Vehicle = require("../models/vehicleRentalModel");
const User = require("../models/userModel");
const connectDB = require("../config/db");

const userData = {
  name: "alla",
  username: "tutu",
  password: "red",
  phone_number: "555-123-4567",
  licenseNumber: "54",
  date_of_birth: "01.10.26",
  address: {
    licenseExpiryDate: "33.11.21",
    city: "espoo",
    yearsOfExperience: "7",
  },
};


const initialVehicles = [
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

const vehiclesInDb = async () => {
  const vehicles = await Vehicle.find({});
  return vehicles.map((vehicle) => vehicle.toJSON());
};

let token = null;

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
  await Vehicle.deleteMany({});

  const signupResponse = await api
    .post("/api/users/signup")
    .send(userData)
    .expect(201);

  token = signupResponse.body.token;
});

beforeEach(async () => {
  await Vehicle.deleteMany({});

  for (const vehicle of initialVehicles) {
    await api
      .post("/api/vehicleRentals")
      .set("Authorization", `Bearer ${token}`)
      .send(vehicle)
      .expect(201);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

// `GET /api/vehicles`

describe("GET /api/vehicles", () => {
  it("should return all vehicles", async () => {
    const response = await api.get("/api/vehicleRentals").expect(200);

    expect(response.body).toHaveLength(initialVehicles.length);
  });

  it("should return vehicles as JSON with status 200", async () => {
    await api
      .get("/api/vehicleRentals")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should include a specific vehicle in the returned list", async () => {
    const response = await api.get("/api/vehicleRentals");

    expect(response.body.map((vehicle) => vehicle.vehicleModel)).toContain(
      "Tesla"
    );
  });
});

// `GET /api/vehicles/:vehicleId`

describe("GET /api/vehicleRentals/:vehicleId", () => {
  describe("when the id is valid", () => {
    it("should return one vehicle by ID", async () => {
      const vehicle = await Vehicle.findOne({ vehicleModel: "Tesla" });

      const response = await api
        .get(`/api/vehicleRentals/${vehicle._id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.vehicleModel).toBe(vehicle.vehicleModel);
    });
  });

  describe("when the id is invalid", () => {
    it("should return status 400", async () => {
      const response = await api.get("/api/vehicleRentals/not-a-valid-id").expect(400);

      expect(response.body).toHaveProperty("message", "Invalid vehicle ID");
    });
  });
});

// `POST /api/vehicles`

describe("POST /api/vehicleRentals", () => {
  describe("when the user is authenticated", () => {
    it("should return status 201", async () => {
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
        .set("Authorization", `Bearer ${token}`)
        .send(newVehicle)
        .expect(201)
        .expect("Content-Type", /application\/json/);
    });

    it("should persist the new vehicle with a user_id", async () => {
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

      const response = await api
        .post("/api/vehicleRentals")
        .set("Authorization", `Bearer ${token}`)
        .send(newVehicle)
        .expect(201);

      expect(response.body.vehicleModel).toBe(newVehicle.vehicleModel);
      expect(response.body).toHaveProperty("user_id");

      const vehiclesAtEnd = await vehiclesInDb();
      expect(vehiclesAtEnd).toHaveLength(initialVehicles.length + 1);
    });
  });

  describe("when the user is not authenticated", () => {
    it("should return status 401", async () => {
      await api.post("/api/vehicleRentals").send(initialVehicles[0]).expect(401);
    });

    it("should not increase the number of vehicles in the database", async () => {
      await api.post("/api/vehicleRentals").send(initialVehicles[0]).expect(401);

      const vehiclesAtEnd = await vehiclesInDb();
      expect(vehiclesAtEnd).toHaveLength(initialVehicles.length);
    });
  });
});

// `PUT /api/vehicles/:vehicleId`

describe("PUT /api/vehicleRentals/:vehicleId", () => {
  describe("when the user is authenticated", () => {
    it("should return status 200", async () => {
      const vehicle = await Vehicle.findOne({ vehicleModel: "Toyota" });

      await api
        .put(`/api/vehicleRentals/${vehicle._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ dailyPrice: 4200, description: "Updated vehicle description." })
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    it("should persist the updated fields in the database", async () => {
      const vehicle = await Vehicle.findOne({ vehicleModel: "Toyota" });

      await api
        .put(`/api/vehicleRentals/${vehicle._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ dailyPrice: 4200, description: "Updated vehicle description." })
        .expect(200);

      const updatedVehicle = await Vehicle.findById(vehicle._id);
      expect(updatedVehicle.dailyPrice).toBe(4200);
      expect(updatedVehicle.description).toBe("Updated vehicle description.");
    });
  });

  describe("when the user is not authenticated", () => {
    it("should return status 401", async () => {
      const vehicle = await Vehicle.findOne({ vehicleModel: "Toyota" });

      await api
        .put(`/api/vehicleRentals/${vehicle._id}`)
        .send({ dailyPrice: 1 })
        .expect(401);
    });
  });

  describe("when the id is invalid", () => {
    it("should return status 400", async () => {
      const response = await api
        .put("/api/vehicleRentals/not-a-valid-id")
        .set("Authorization", `Bearer ${token}`)
        .send({ dailyPrice: 1 })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Invalid vehicle ID");
    });
  });
});

//`DELETE /api/vehicles/:vehicleId`

describe("DELETE /api/vehicleRentals/:vehicleId", () => {
  describe("when the user is authenticated", () => {
    it("should return status 204", async () => {
      const vehicle = await Vehicle.findOne({ vehicleModel: "Toyota" });

      await api
        .delete(`/api/vehicleRentals/${vehicle._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);
    });

    it("should remove the vehicle from the database", async () => {
      const vehiclesAtStart = await vehiclesInDb();
      const vehicleToDelete = vehiclesAtStart[0];

      await api
        .delete(`/api/vehicleRentals/${vehicleToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const vehiclesAtEnd = await vehiclesInDb();
      expect(vehiclesAtEnd).toHaveLength(vehiclesAtStart.length - 1);
      expect(vehiclesAtEnd.map((vehicle) => vehicle.vehicleModel)).not.toContain(
        vehicleToDelete.vehicleModel
      );
    });
  });

  describe("when the user is not authenticated", () => {
    it("should return status 401", async () => {
      const vehicle = await Vehicle.findOne({ vehicleModel: "Toyota" });

      await api.delete(`/api/vehicleRentals/${vehicle.id}`).expect(401);
    });
  });

  describe("when the id is invalid", () => {
    it("should return status 400", async () => {
      const response = await api
        .delete("/api/vehicleRentals/not-a-valid-id")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(response.body).toHaveProperty("message", "Invalid vehicle ID");
    });
  });
});



  //   const newVehicle = {
  //     vehicleModel: "Tesla",
  //     category: "electric",
  //     description: "red",
  //     agency: { name: "Red", contactEmail: "tesla@gmail.com", fleetSize: 2 },
  //     location: { city: "Espoo", state: "Uusimaa" },
  //     dailyPrice: 10000,
  //     listingDate: "01.10.26",
  //     availabilityStatus: "available",
  //     bookingDeadline: "10.10.26",
  //     insurancePolicy: "yes",
  //   };