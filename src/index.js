
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const ballotRoutes = require('./routes/ballot.routes');
const voteRoutes = require('./routes/vote.routes');
const resultsRoutes = require('./routes/results.routes');


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/ballot', ballotRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/results', resultsRoutes);


// Simple test route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is running',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
