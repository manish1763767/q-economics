require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/q_economics',
    dialect: 'postgres',
    logging: false
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
};
