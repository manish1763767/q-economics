require('dotenv').config();
const { User } = require('../models');
const { sequelize } = require('../models/index');

async function createAdminUser() {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync models
        await sequelize.sync();
        console.log('Models synchronized.');

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@qeconomics.com',
            password: 'admin123', // This will be hashed by the User model hooks
            role: 'admin'
        });

        console.log('Admin user created successfully:');
        console.log({
            name: admin.name,
            email: admin.email,
            role: admin.role
        });

        console.log('\nYou can now login to the admin panel with:');
        console.log('Email: admin@qeconomics.com');
        console.log('Password: admin123');
        console.log('\nPlease change the password after first login.');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        process.exit();
    }
}

createAdminUser();
