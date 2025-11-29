const jwt = require('jsonwebtoken');
const Voter = require('../models/voter.model');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

class AuthService {
  constructor(voterModel = Voter, jwtLib = jwt, secret = JWT_SECRET) {
    this.Voter = voterModel;
    this.jwt = jwtLib;
    this.secret = secret;
  }

  /**
   * Validate idNumber + password, return voter or null.
   */
  async validate(idNumber, password) {
    const voter = await this.Voter.findOne({ idNumber });

    if (!voter) return null;
    if (voter.status !== 'Active') return null;

    // For now, treat passwordHash as plain text password
    if (voter.passwordHash !== password) {
      return null;
    }

    return voter;
  }

  /**
   * Create JWT token for a voter.
   */
  generateToken(voter) {
    return this.jwt.sign(
      {
        sub: voter._id.toString(),
        role: 'voter',
      },
      this.secret,
      { expiresIn: '2h' }
    );
  }
}

// Singleton instance used by the rest of the app
const authServiceInstance = new AuthService();

/**
 * Wrapper function so existing code that calls validate(...)
 * still works the same. This simply forwards to the class instance.
 */
async function validate(idNumber, password) {
  return authServiceInstance.validate(idNumber, password);
}

/**
 * Wrapper function so existing code that calls generateToken(...)
 * still works the same. This simply forwards to the class instance.
 */
function generateToken(voter) {
  return authServiceInstance.generateToken(voter);
}

module.exports = {
  // ✅ same API as before
  validate,
  generateToken,

  // extra exports for tests / OOP flavor
  AuthService,
  authServiceInstance,
};
