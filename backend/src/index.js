const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'ok',
      timestamp: result.rows[0].now,
      db: 'connected'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await db.query('SELECT 1 as test');
    res.json({ status: 'ok', result: result.rows[0] });
  } catch (err) {
    res.status(500).json({ 
      status: 'error', 
      message: err.message,
      code: err.code,
      detail: err.detail
    });
  }
});

app.get('/api/test-maps', async (req, res) => {
  const directionsService = require('./services/googleMaps');
  try {
    const data = await directionsService.getDirections(
      'Chiang Mai Old City',
      'Doi Suthep'
    );
    res.json({
      status: 'ok',
      routes: data.routes?.length || 0,
      sample: data.routes?.[0]?.summary || 'No route found'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
