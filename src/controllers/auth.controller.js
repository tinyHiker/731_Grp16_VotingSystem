const AuthService = require('../services/auth.service');
const Voter = require('../models/voter.model');

class AuthController {
  constructor(authService = AuthService, voterModel = Voter) {
    this.authService = authService;
    this.Voter = voterModel;
    this.login = this.login.bind(this);
  }

  
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

  
  async login(req, res) {
    try {
      const validation = this.validateLoginPayload(req.body);

      if (!validation.isValid) {
        
        return res
          .status(400)
          .json({ error: validation.errors.join(', ') });
      }

      const { idNumber, password } = req.body;

      const voter = await this.authService.validate(idNumber, password);
      if (!voter) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = this.authService.generateToken(voter);
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


const authController = new AuthController();
module.exports = authController;
module.exports.AuthController = AuthController;
