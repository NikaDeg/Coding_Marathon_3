const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/userModel");

const api = supertest(app);

const validUser = {
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

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/users/signup", () => {
  describe("when the payload is valid", () => {
    it("should return status 201", async () => {
      await api
        .post("/api/users/signup")
        .send(validUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);
    });

    it("should return an username and token", async () => {
      const response = await api
        .post("/api/users/signup")
        .send(validUser)
        .expect(201);

      expect(response.body).toHaveProperty("token");
      expect(response.body.username).toBe(validUser.username);
    });

    it("should persist the user in the database", async () => {
      await api.post("/api/users/signup").send(validUser).expect(201);

      const savedUser = await User.findOne({ username: validUser.username });
      expect(savedUser).not.toBeNull();
      expect(savedUser.name).toBe(validUser.name);
    });
  });

  describe("when the payload is invalid", () => {
    it("should return status 400 when required fields are missing", async () => {
      const response = await api
        .post("/api/users/signup")
        .send({ username: "example" })
        .expect(400);

      expect(response.body).toHaveProperty("error", "Please add all fields");
    });
  });

  describe("when the username is already registered", () => {
    it("should return status 400", async () => {
      await api.post("/api/users/signup").send(validUser).expect(201);

      const response = await api
        .post("/api/users/signup")
        .send({ ...validUser, name: "alla" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await api.post("/api/users/signup").send(validUser).expect(201);
  });

  describe("when the credentials are valid", () => {
    it("should return status 200", async () => {
      await api
        .post("/api/users/login")
        .send({
          username: validUser.username,
          password: validUser.password,
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    it("should return an username and token", async () => {
      const response = await api
        .post("/api/users/login")
        .send({
          username: validUser.username,
          password: validUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body.username).toBe(validUser.username);
    });
  });

  describe("when the credentials are invalid", () => {
    it("should return status 400", async () => {
      const response = await api
        .post("/api/users/login")
        .send({
          username: validUser.username,
          password: "WrongPassword!",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });
  });
});
