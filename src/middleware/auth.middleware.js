const jwt = require('jsonwebtoken');
const Voter = require('../models/voter.model');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.substring(7); // remove "Bearer "

    const payload = jwt.verify(token, JWT_SECRET);

    const voter = await Voter.findById(payload.sub);
    if (!voter || voter.status !== 'Active') {
      return res.status(401).json({ error: 'Invalid or inactive voter' });
    }

    // Attach voter to request for later use
    req.user = {
      id: voter._id,
      idNumber: voter.idNumber,
      name: voter.name,
      hasVoted: voter.hasVoted,
    };

    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = authMiddleware;
