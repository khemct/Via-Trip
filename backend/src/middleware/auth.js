const jwtUtils = require('../utils/jwt')

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }
    
    const token = authHeader.split(' ')[1]
    const decoded = jwtUtils.verify(token)
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

module.exports = authMiddleware
