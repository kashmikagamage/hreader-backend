const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const db = require('../config/database');

var Trainer = db.define('trainer', {
    nic: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'trainer_nic_unique'
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    telno: {
        type: Sequelize.STRING,
        allowNull: false
    },
    firstname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false
        // allowNull defaults to true
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: false
        // allowNull defaults to true
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
        // allowNull defaults to true
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    workplace: {
        type: Sequelize.STRING,
        allowNull: false
    },
    googleId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: 'trainer_googleId_unique'
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true
    }


}, {
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
    freezeTableName: true

});
// User.hasOne(User, {
//     foreignKey: 'employeeId',
// })

module.exports = Trainer;