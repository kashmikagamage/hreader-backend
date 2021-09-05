const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const db = require('../config/database');

var User = db.define('user', {
    nic: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    gender: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    address: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    height: {
        type: Sequelize.INTEGER,
    },
    weight: {
        type: Sequelize.INTEGER,
    }
    
}, {
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
    freezeTableName: true

});
// User.hasMany(User, {
//     foreignKey: 'employeeId',
// })

module.exports = User;

