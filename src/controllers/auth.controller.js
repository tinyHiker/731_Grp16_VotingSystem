const AuthService = require('../services/auth.service');
const Voter = require('../models/voter.model');

async function login(req, res) {
  try {
    const { idNumber, password } = req.body;

    if (!idNumber || !password) {
      return res.status(400).json({ error: 'idNumber and password are required' });
    }

    const voter = await AuthService.validate(idNumber, password);
    if (!voter) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = AuthService.generateToken(voter);

    // Update lastLoginAt & reset failedAttempts
    voter.lastLoginAt = new Date();
    voter.failedAttempts = 0;
    await voter.save();

    res.json({
      token,
      voter: {
        id: voter._id,
        idNumber: voter.idNumber,
        name: voter.name,
        email: voter.email,
        hasVoted: voter.hasVoted,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  login,
};
