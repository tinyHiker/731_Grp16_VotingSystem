const VoteService = require('../services/vote.service');

async function submitVote(req, res) {
  try {
    const { electionId, candidateIds } = req.body;

    if (!electionId || !candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({ error: 'electionId and candidateIds[] are required' });
    }

    const sourceIp =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const vote = await VoteService.recordVote(
      req.user.id,
      electionId,
      candidateIds,
      sourceIp
    );

    res.status(201).json({
      message: 'Vote recorded successfully',
      voteId: vote._id,
    });
  } catch (err) {
    console.error('Submit vote error:', err);

    if (err.message === 'Voter has already voted') {
      return res.status(400).json({ error: err.message });
    }

    if (err.code === 11000) {
      // Duplicate key from unique index (voterId + electionId)
      return res.status(400).json({ error: 'Duplicate vote detected' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  submitVote,
};
