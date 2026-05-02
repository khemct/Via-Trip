const db = require('../config/db');
const passwordUtils = require('../utils/password');
const jwtUtils = require('../utils/jwt');
const emailService = require('../services/emailService');

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
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email already registered' });
      }
      res.status(500).json({ error: 'Registration failed' });
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
      res.status(500).json({ error: 'Login failed' });
    }
  },
  
  requestPasswordReset: async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Email not found' });
      }
      
      const user = result.rows[0];
      const resetToken = jwtUtils.sign({ id: user.id, email: user.email }, '10m');
      
      await db.query(
        'UPDATE users SET reset_token = $1, reset_expires = NOW() + INTERVAL \'10 minutes\' WHERE id = $2',
        [resetToken, user.id]
      );
      
      emailService.sendPasswordReset(email, resetToken);
      
      res.json({ message: 'Password reset link sent to email' });
    } catch (error) {
      res.status(500).json({ error: 'Password reset request failed' });
    }
  },
  
  confirmPasswordReset: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
      }
      
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      
      const decoded = jwtUtils.verify(token);
      if (!decoded) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      
      const result = await db.query(
        'SELECT * FROM users WHERE id = $1 AND reset_token = $2 AND reset_expires > NOW()',
        [decoded.id, token]
      );
      
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      
      const password_hash = await passwordUtils.hash(newPassword);
      
      await db.query(
        'UPDATE users SET password_hash = $1, reset_token = NULL, reset_expires = NULL WHERE id = $2',
        [password_hash, decoded.id]
      );
      
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(500).json({ error: 'Password reset failed' });
    }
  },
  
  getProfile: async (req, res) => {
    try {
      const result = await db.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
        [req.user.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }
};

module.exports = authController;
