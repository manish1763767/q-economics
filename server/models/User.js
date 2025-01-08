const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    defaultValue: 'student',
  },
});

// Hash password before saving
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Improved registration and login logic
async function registerUser(username, password) {
  // Add validation and error handling
  if (!username || !password) {
    throw new Error('Username and password are required.');
  }
  try {
    // Hash password and save to database
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email: username, password: hashedPassword, role: 'student' }); // Set default role to student
    return user;
  } catch (error) {
    console.error('Error registering user:', error.message); // Log error message
    console.error('Full error details:', error); // Log full error details
    throw new Error('Registration failed. Please try again.');
  }
}

async function loginUser(username, password) {
  // Add validation and error handling
  if (!username || !password) {
    throw new Error('Username and password are required.');
  }
  // Verify user credentials
  const user = await User.findOne({ where: { email: username } });
  if (!user) {
    throw new Error('Invalid username or password');
  }
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new Error('Invalid username or password');
  }
  return user;
}

module.exports = { User, registerUser, loginUser };
