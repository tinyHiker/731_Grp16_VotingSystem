const BallotService = require('../services/ballot.service');

async function getBallot(req, res) {
  try {
    const ballot = await BallotService.getCurrentBallot();

    if (!ballot) {
      return res.status(404).json({ error: 'No open election found' });
    }

    res.json({
      election: ballot.election,
      candidates: ballot.candidates,
      voter: req.user, // optional, but can be handy frontend side
    });
  } catch (err) {
    console.error('Get ballot error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getBallot,
};
