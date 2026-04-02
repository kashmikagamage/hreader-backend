const Sequelize = require('sequelize');

const db = require('../config/database');
const Trainer = require('./trainer');
const User = require('./user');

var Train = db.define('train', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    trainerId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true

    }

}, {
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
    freezeTableName: true

});

User.belongsToMany(Trainer, { through: Train });
Trainer.belongsToMany(User, { through: Train });
Train.belongsTo(User, { foreignKey: 'userId' });

// Train.hasOne(User, {
//     foreignKey: 'userId'
// })
// Train.hasOne(Trainer, {
//     foreignKey: 'trainerId'
// })
module.exports = Train;