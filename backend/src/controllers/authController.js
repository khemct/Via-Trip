const db = require('../config/db');
const passwordUtils = require('../utils/password');
const jwtUtils = require('../utils/jwt');

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }
      
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      
      const password_hash = await passwordUtils.hash(password);
      const userRole = role && ['traveler', 'place_owner', 'admin'].includes(role) ? role : 'traveler';
      
      const result = await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [name, email, password_hash, userRole]
      );
      
      const user = result.rows[0];
      const token = jwtUtils.sign({ id: user.id, email: user.email, role: user.role });
      
      res.status(201).json({ user, token });
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(409).json({ error: 'Email already registered' });
      }
      res.status(500).json({ error: error.message });
    }
  },
  
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const user = result.rows[0];
      const isValid = await passwordUtils.compare(password, user.password_hash);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwtUtils.sign({ id: user.id, email: user.email, role: user.role });
      
      res.json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  requestPasswordReset: async (req, res) => {
    res.status(501).json({ message: 'Password reset not implemented yet' });
  },
  
  confirmPasswordReset: async (req, res) => {
    res.status(501).json({ message: 'Password reset not implemented yet' });
  }
};

module.exports = authController;
