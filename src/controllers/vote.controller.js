const VoteService = require('../services/vote.service');

class VoteController {
  constructor(voteService = VoteService) {
    this.voteService = voteService;
    this.submitVote = this.submitVote.bind(this);
  }

  
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

 
  getSourceIp(req) {
    return (
      req.headers?.['x-forwarded-for'] ||
      req.socket?.remoteAddress ||
      ''
    );
  }

  
  buildSuccessResponse(vote) {
    if (!vote || !vote._id) return null;

    return {
      message: 'Vote recorded successfully',
      voteId: vote._id,
    };
  }

  
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
        
        return res.status(400).json({ error: 'Duplicate vote detected' });
      }

      return res
        .status(500)
        .json({ error: 'Internal server error' });
    }
  }
}


const voteController = new VoteController();
module.exports = voteController;
module.exports.VoteController = VoteController;
