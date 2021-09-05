const Sequelize = require('sequelize');

const db = require('../config/database');
const Trainer = require('./trainer');
const User = require('./user');

var Usage = db.define('usage', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    usageData: {
        type: Sequelize.STRING,
        allowNull: false,

    },

    status: {
        type: Sequelize.STRING,
        allowNull: true,

    },

    average: {
        type: Sequelize.STRING,
        allowNull: true,

    },

    time: {
        type: Sequelize.STRING,
        allowNull: false,

    }

}, {
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
    freezeTableName: true

});

Usage.belongsTo(User, {
    foreignKey: 'userId'
})
User.hasMany(Usage)
module.exports = Usage;