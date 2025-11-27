const jwt = require('jsonwebtoken');
const Voter = require('../models/voter.model');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Validate idNumber + password, return voter or null
async function validate(idNumber, password) {
  const voter = await Voter.findOne({ idNumber });

  if (!voter) return null;
  if (voter.status !== 'Active') return null;

  // For now, treat passwordHash as plain text password
  if (voter.passwordHash !== password) {
    return null;
  }

  return voter;
}

// Create JWT token for a voter
function generateToken(voter) {
  return jwt.sign(
    {
      sub: voter._id.toString(),
      role: 'voter',
    },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
}

module.exports = {
  validate,
  generateToken,
};
