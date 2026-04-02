const Sequelize = require('sequelize');
const db = require('../config/database');

/**
 * Session model to track active user sessions
 * Prevents multiple concurrent logins from different devices
 */
const Session = db.define('session', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  trainerId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'trainer',
      key: 'id'
    }
  },
  sessionToken: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true
  },
  userAgent: {
    type: Sequelize.STRING,
    allowNull: true
  },
  ipAddress: {
    type: Sequelize.STRING,
    allowNull: true
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  lastActivityAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: true,
  updatedAt: false
});

module.exports = Session;
