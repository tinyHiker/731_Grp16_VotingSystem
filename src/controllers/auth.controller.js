const AuthService = require('../services/auth.service');
const Voter = require('../models/voter.model');

class AuthController {
  constructor(authService = AuthService, voterModel = Voter) {
    this.authService = authService;
    this.Voter = voterModel;

    // bind methods used as route handlers
    this.login = this.login.bind(this);
  }

  /**
   * Pure helper to validate the login payload.
   * Great for unit tests: input body -> { isValid, errors[] }
   */
  validateLoginPayload(body) {
    const errors = [];

    if (!body || typeof body !== 'object') {
      errors.push('Request body is required');
      return { isValid: false, errors };
    }

    const { idNumber, password } = body;

    if (!idNumber) {
      errors.push('idNumber is required');
    }

    if (!password) {
      errors.push('password is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Pure helper to shape the voter object for the API response.
   * Also easy to unit test.
   */
  buildVoterResponse(voter) {
    if (!voter) return null;

    return {
      id: voter._id,
      idNumber: voter.idNumber,
      name: voter.name,
      email: voter.email,
      hasVoted: voter.hasVoted,
    };
  }

  /**
   * Express route handler: POST /api/auth/login
   */
  async login(req, res) {
    try {
      const validation = this.validateLoginPayload(req.body);

      if (!validation.isValid) {
        // Mirror original behavior: 400 for missing fields
        return res
          .status(400)
          .json({ error: validation.errors.join(', ') });
      }

      const { idNumber, password } = req.body;

      const voter = await this.authService.validate(idNumber, password);
      if (!voter) {
        // Mirror original behavior: 401 for invalid credentials
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = this.authService.generateToken(voter);

      // Update lastLoginAt & reset failedAttempts
      voter.lastLoginAt = new Date();
      voter.failedAttempts = 0;
      await voter.save();

      return res.json({
        token,
        voter: this.buildVoterResponse(voter),
      });
    } catch (err) {
      console.error('Login error:', err);
      return res
        .status(500)
        .json({ error: 'Internal server error' });
    }
  }
}

// Default instance used by the app
const authController = new AuthController();

// Export both the instance (for routes) and the class (for tests)
module.exports = authController;
module.exports.AuthController = AuthController;
