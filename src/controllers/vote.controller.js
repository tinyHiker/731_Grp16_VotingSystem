const VoteService = require('../services/vote.service');

class VoteController {
  constructor(voteService = VoteService) {
    this.voteService = voteService;

    // Bind for use as Express route handler
    this.submitVote = this.submitVote.bind(this);
  }

  /**
   * ✅ Pure helper: validate payload for submitVote.
   *    Great for unit tests: body -> { isValid, errors[] }.
   */
  validateVotePayload(body) {
    const errors = [];

    if (!body || typeof body !== 'object') {
      errors.push('Request body is required');
      return { isValid: false, errors };
    }

    const { electionId, candidateIds } = body;

    if (!electionId) {
      errors.push('electionId is required');
    }

    if (!candidateIds) {
      errors.push('candidateIds is required');
    } else if (!Array.isArray(candidateIds)) {
      errors.push('candidateIds must be an array');
    } else if (candidateIds.length === 0) {
      errors.push('candidateIds must not be empty');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * ✅ Pure helper-ish: determine source IP.
   *    Easy to test with a fake req object.
   */
  getSourceIp(req) {
    return (
      req.headers?.['x-forwarded-for'] ||
      req.socket?.remoteAddress ||
      ''
    );
  }

  /**
   * ✅ Pure helper: build success response body.
   *    vote -> { message, voteId }
   */
  buildSuccessResponse(vote) {
    if (!vote || !vote._id) return null;

    return {
      message: 'Vote recorded successfully',
      voteId: vote._id,
    };
  }

  /**
   * Express handler: POST /api/vote
   * Mirrors your original behavior.
   */
  async submitVote(req, res) {
    try {
      const validation = this.validateVotePayload(req.body);

      if (!validation.isValid) {
        return res
          .status(400)
          .json({ error: validation.errors.join(', ') });
      }

      const { electionId, candidateIds } = req.body;
      const sourceIp = this.getSourceIp(req);

      const vote = await this.voteService.recordVote(
        req.user.id,
        electionId,
        candidateIds,
        sourceIp
      );

      const responseBody = this.buildSuccessResponse(vote);
      return res.status(201).json(responseBody);
    } catch (err) {
      console.error('Submit vote error:', err);

      if (err.message === 'Voter has already voted') {
        return res.status(400).json({ error: err.message });
      }

      if (err.code === 11000) {
        // Duplicate key from unique index (voterId + electionId)
        return res.status(400).json({ error: 'Duplicate vote detected' });
      }

      return res
        .status(500)
        .json({ error: 'Internal server error' });
    }
  }
}

// Default instance for routes
const voteController = new VoteController();

// Export instance (for app) and class (for tests)
module.exports = voteController;
module.exports.VoteController = VoteController;
