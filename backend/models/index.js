const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: process.env.NODE_ENV === 'production' ? {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    } : {},
    logging: false
});

// Define Mock Test model
const MockTest = sequelize.define('MockTest', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    duration: {
        type: Sequelize.STRING,
        allowNull: false
    },
    questions: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// Define Previous Paper model
const PreviousPaper = sequelize.define('PreviousPaper', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        await sequelize.sync();
        console.log('Models synchronized with database.');

        // Create admin user if not exists
        const User = require('./user');
        const adminExists = await User.findOne({
            where: { role: 'admin' }
        });

        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@qeconomics.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Default admin user created');
        }

        // Seed initial data if tables are empty
        const testCount = await MockTest.count();
        if (testCount === 0) {
            await MockTest.bulkCreate([
                {
                    title: "Microeconomics Full Test",
                    duration: "3 hours",
                    questions: 100
                },
                {
                    title: "Macroeconomics Full Test",
                    duration: "3 hours",
                    questions: 100
                },
                {
                    title: "Indian Economy Test",
                    duration: "3 hours",
                    questions: 100
                }
            ]);
        }

        const paperCount = await PreviousPaper.count();
        if (paperCount === 0) {
            await PreviousPaper.bulkCreate([
                {
                    title: "2023 Economics Paper",
                    type: "UPSC General Studies",
                    url: "/papers/2023.pdf"
                },
                {
                    title: "2022 Economics Paper",
                    type: "UPSC General Studies",
                    url: "/papers/2022.pdf"
                },
                {
                    title: "2021 Economics Paper",
                    type: "UPSC General Studies",
                    url: "/papers/2021.pdf"
                }
            ]);
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = {
    sequelize,
    MockTest,
    PreviousPaper,
    initDb
};
