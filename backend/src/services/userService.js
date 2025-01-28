const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Service to register a new user
exports.registerUser = async (username, email, password) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      throw new Error('User already exists');
    }

    // Create a new user
    user = new User({
      username,
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user
    await user.save();

    // Create and return a JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) reject(err);
          resolve(token);
        }
      );
    });
  } catch (err) {
    throw err;
  }
};

// Service to login a user
exports.loginUser = async (email, password) => {
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Create and return a JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) reject(err);
          resolve(token);
        }
      );
    });
  } catch (err) {
    throw err;
  }
};
