const jwt = require('jsonwebtoken');

const jwtUtils = {
  sign: (payload, expiresIn = '7d') => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn });
  },
  
  verify: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');
    } catch (error) {
      return null;
    }
  }
};

module.exports = jwtUtils;
