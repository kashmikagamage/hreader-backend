/**
 * Set a secure httpOnly cookie with authentication token
 * @param {Object} res - Express response object
 * @param {String} token - Authentication token
 * @param {String} cookieName - Name of the cookie (default: 'authToken')
 */
const setSecureAuthCookie = (res, token, cookieName = 'authToken') => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie(cookieName, token, {
    httpOnly: true,        // Prevents JavaScript from accessing the cookie
    secure: isProduction,  // Only send over HTTPS in production
    sameSite: 'Strict',    // Prevents CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/'
  });
};

/**
 * Clear authentication cookie
 * @param {Object} res - Express response object
 * @param {String} cookieName - Name of the cookie to clear
 */
const clearAuthCookie = (res, cookieName = 'authToken') => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/'
  });
};

module.exports = {
  setSecureAuthCookie,
  clearAuthCookie
};
