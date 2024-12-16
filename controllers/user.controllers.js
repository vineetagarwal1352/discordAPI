const User = require("../models/User");
const Subscription = require("../models/Subscription");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
require("dotenv").config();

// Discord Auth
exports.discordAuth = async (req, res) => {
  console.log("entered");
  const { code } = req.query;

  // If the code is missing, return an error
  if (!code) {
    return res.send("Error: No code provided");
  }

  try {
    const API_ENDPOINT = "https://discord.com";
    const client_id = "1318155261243817994";
    const client_secret = "9EYQs-OorXLWO2b-OC9HLDywKJ8VdUn1";
    const data = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://localhost:3000/api/users/authRedirect",
    });

    const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64"
    );
    const response = await axios.post(
      `https://discord.com/oauth2/token`,
      data.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authHeader}`,
        },
      }
    );
    return res.send(response);
    // const { access_token, refresh_token } = response.data;

    // // Store the tokens securely (for example, in a database or session)
    // console.log('Access Token:', access_token);
    // console.log('Refresh Token:', refresh_token);

    // // Step 4: Use the access token to make authorized API requests
    // const userResponse = await axios.get(`${BASE_API_URL}/users/@me`, {
    //   headers: {
    //     Authorization: `Bearer ${access_token}`,
    //   },
    // });

    // if (!email) {
    //   return res
    //     .status(400)
    //     .json({ message: "Email is required in Discord data." });
    // }

    // let user = await User.findOne({ email });

    // if (!user) {
    //   const password = "Default_pass#1234";
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   const newUser = new User({ username, email, password: hashedPassword });
    //   user = await newUser.save();
    // }

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    // const redirectUrl = `https://discord.com/channels/@me?access_token=${token}`;
    // res.redirect(redirectUrl);
  } catch (err) {
    // Handle Discord API or server errors
    if (err.response && err.response.status === 401) {
      return res.status(401).json({ message: "Invalid Discord token." });
    }
    logger.error(`Error in Discord signup: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error signing up user", error: err.message });
  }
};

// Create a new user
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists. Please log in." });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    logger.error(`Error creating user: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", userID: user.userID, token });
  } catch (err) {
    logger.error(`Error logging in: ${err.message}`);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-__v").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    user.userID = user._id;
    delete user._id;
    res.json(user);
  } catch (err) {
    logger.error(`Error retrieving user: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error retrieving user", error: err.message });
  }
};

// Update user password only
exports.updatePassword = async (req, res) => {
  const { password } = req.body;
  const userID = req.params.id;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user password only
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { password: hashedPassword },
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    logger.info(`Password updated successfully for user ID: ${userID}`);
    res.json({
      message: "Password updated successfully",
      userID: updatedUser._id,
    });
  } catch (err) {
    logger.error(
      `Error updating password for user ID ${userID}: ${err.message}`
    );
    res
      .status(500)
      .json({ message: "Error updating password", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userID = req.params.id;
  try {
    // First, delete all subscriptions that belong to the user
    await Subscription.deleteMany({ userID });

    // Now delete the user
    const deletedUser = await User.findByIdAndDelete(userID);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User and all associated subscriptions deleted successfully",
    });
  } catch (err) {
    logger.error(`Error deleting user and subscriptions: ${err.message}`);
    res.status(500).json({
      message: "Error deleting user and subscriptions",
      error: err.message,
    });
  }
};
