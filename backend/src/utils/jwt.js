const jwt = require('jsonwebtoken');

const jwtUtils = {
  sign: (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: '7d' });
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
