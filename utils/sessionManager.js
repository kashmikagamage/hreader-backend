const jwt = require('jsonwebtoken');
const Session = require('../models/session');

/**
 * Generate a JWT token
 */
const generateToken = (userId, trainerId, userType) => {
  const payload = {
    userId: userId || null,
    trainerId: trainerId || null,
    userType: userType, // 'user' or 'trainer'
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '24h'
  });
};

/**
 * Create a new session - invalidates all previous sessions for the user
 * @param {Object} options - { userId, trainerId, userAgent, ipAddress, userType }
 */
const createSession = async (options) => {
  const { userId, trainerId, userAgent, ipAddress, userType } = options;

  try {
    // Invalidate all previous sessions for this user
    const userIdentifier = userId ? { userId } : { trainerId };
    await Session.update(
      { isActive: false },
      { where: userIdentifier }
    );

    // Generate new token
    const sessionToken = generateToken(userId, trainerId, userType);

    // Create new session
    const session = await Session.create({
      userId: userId || null,
      trainerId: trainerId || null,
      sessionToken,
      userAgent: userAgent || 'Unknown',
      ipAddress: ipAddress || 'Unknown',
      isActive: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    return {
      sessionId: session.id,
      token: sessionToken,
      expiresAt: session.expiresAt
    };
  } catch (err) {
    console.error('Error creating session:', err);
    throw err;
  }
};

/**
 * Validate a session token
 */
const validateSession = async (token, sessionId) => {
  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if session exists and is active
    const session = await Session.findOne({
      where: {
        id: sessionId,
        sessionToken: token,
        isActive: true,
        expiresAt: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!session) {
      return null;
    }

    // Update last activity
    await session.update({ lastActivityAt: new Date() });

    return {
      sessionId: session.id,
      userId: session.userId,
      trainerId: session.trainerId,
      userType: decoded.userType,
      decoded
    };
  } catch (err) {
    console.error('Session validation error:', err);
    return null;
  }
};

/**
 * Invalidate a session
 */
const invalidateSession = async (sessionId) => {
  try {
    await Session.update(
      { isActive: false },
      { where: { id: sessionId } }
    );
    return true;
  } catch (err) {
    console.error('Error invalidating session:', err);
    return false;
  }
};

/**
 * Invalidate all sessions for a user
 */
const invalidateAllUserSessions = async (userId) => {
  try {
    await Session.update(
      { isActive: false },
      { where: { userId } }
    );
    return true;
  } catch (err) {
    console.error('Error invalidating user sessions:', err);
    return false;
  }
};

/**
 * Invalidate all sessions for a trainer
 */
const invalidateAllTrainerSessions = async (trainerId) => {
  try {
    await Session.update(
      { isActive: false },
      { where: { trainerId } }
    );
    return true;
  } catch (err) {
    console.error('Error invalidating trainer sessions:', err);
    return false;
  }
};

/**
 * Clean up expired sessions
 */
const cleanupExpiredSessions = async () => {
  try {
    await Session.destroy({
      where: {
        expiresAt: {
          [require('sequelize').Op.lt]: new Date()
        }
      }
    });
  } catch (err) {
    console.error('Error cleaning up sessions:', err);
  }
};

/**
 * Get all active sessions for a user
 */
const getUserSessions = async (userId) => {
  try {
    return await Session.findAll({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          [require('sequelize').Op.gt]: new Date()
        }
      },
      attributes: ['id', 'userAgent', 'ipAddress', 'createdAt', 'lastActivityAt']
    });
  } catch (err) {
    console.error('Error getting user sessions:', err);
    return [];
  }
};

/**
 * Get all active sessions for a trainer
 */
const getTrainerSessions = async (trainerId) => {
  try {
    return await Session.findAll({
      where: {
        trainerId,
        isActive: true,
        expiresAt: {
          [require('sequelize').Op.gt]: new Date()
        }
      },
      attributes: ['id', 'userAgent', 'ipAddress', 'createdAt', 'lastActivityAt']
    });
  } catch (err) {
    console.error('Error getting trainer sessions:', err);
    return [];
  }
};

module.exports = {
  generateToken,
  createSession,
  validateSession,
  invalidateSession,
  invalidateAllUserSessions,
  invalidateAllTrainerSessions,
  cleanupExpiredSessions,
  getUserSessions,
  getTrainerSessions
};
