const BallotService = require('../services/ballot.service');

class BallotController {
  constructor(ballotService = BallotService) {
    this.ballotService = ballotService;

    // Bind methods used as route handlers
    this.getBallot = this.getBallot.bind(this);
  }

  /**
   * ✅ Pure helper: build success response body.
   *    Great for unit tests (input -> output).
   */
  buildBallotResponse(ballot, voter) {
    if (!ballot) return null;

    return {
      election: ballot.election,
      candidates: ballot.candidates,
      voter: voter || null,
    };
  }

  /**
   * ✅ Helper that centralizes the "no open election" response.
   *    Easy to assert on res.status/json in tests.
   */
  handleNoOpenElection(res) {
    return res.status(404).json({ error: 'No open election found' });
  }

  /**
   * Express route handler: GET /api/ballot/current
   * Behavior matches your original function version:
   *  - Calls BallotService.getCurrentBallot()
   *  - 404 if none
   *  - JSON body with election, candidates, voter on success
   *  - 500 on unexpected error
   */
  async getBallot(req, res) {
    try {
      const ballot = await this.ballotService.getCurrentBallot();

      if (!ballot) {
        return this.handleNoOpenElection(res);
      }

      const responseBody = this.buildBallotResponse(ballot, req.user);
      return res.json(responseBody);
    } catch (err) {
      console.error('Get ballot error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Default instance used by routes
const ballotController = new BallotController();

// Export both instance (for routes) and class (for tests)
module.exports = ballotController;
module.exports.BallotController = BallotController;
