import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

//register controller
export async function register(req, res) {
  const { username, email, password } = req.body;
  // in usermodel - username,.... were unique
  // need to check first if they already exist or not before registering
  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isAlreadyRegistered) {
    res.status(409).json({
      message: "Username or email already exists",
    });
  }

  // if user doesn't already exist
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  const user = await userModel.create({
    username,
    email,
    password,
  });

  //now create token
  // we get an id for the data we've stored
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  res.status(201).json({
    message: "User registered siccessfully",
    user: {
      username: user.username,
      email: user.email,
    },
    token,
  });
}
