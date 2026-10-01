const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const signupUser = async (req, res) => {
  const {
    name,
    username,
    password,
    phone_number,
    licenseNumber,
    date_of_birth,
    address,
  } = req.body;

  try {
    if (
      !name ||
      !username ||
      !password ||
      !phone_number ||
      !licenseNumber ||
      !date_of_birth ||
      !address
    ) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const exists = await User.findOne({ username });

    if (exists) {
      throw Error("Username already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      username,
      password: hash,
      phone_number,
      licenseNumber,
      date_of_birth,
      address,
    });

    // create a token
    if (user) {
      const token = createToken(user._id);
      res.status(201).json({ username, token });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw Error("All fields must be filled");
    }

    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = createToken(user._id);
      res.status(200).json({ username, token });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };
