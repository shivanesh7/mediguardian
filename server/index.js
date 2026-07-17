require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/schedules', require('./routes/schedule'));
app.use('/api/appointments', require('./routes/appointment'));

// Start Background Medication Reminders Service
require('./services/notificationService');

// General Route
app.get('/', (req, res) => {
  res.send('Mediguardian API is running');
});

const PORT = process.env.PORT || 5000;

// Sync Database and Start Server
// "alter: true" automatically updates tables if schemas change, perfect for early development
sequelize.sync({ alter: true })
  .then(() => {
    console.log('PostgreSQL database schemas synchronized successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error synchronizing PostgreSQL database:', err.message);
  });
