const BallotService = require('../services/ballot.service');

class BallotController {
  constructor(ballotService = BallotService) {
    this.ballotService = ballotService;

    
    this.getBallot = this.getBallot.bind(this);
  }

  
  buildBallotResponse(ballot, voter) {
    if (!ballot) return null;

    return {
      election: ballot.election,
      candidates: ballot.candidates,
      voter: voter || null,
    };
  }

  
  handleNoOpenElection(res) {
    return res.status(404).json({ error: 'No open election found' });
  }

  
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


const ballotController = new BallotController();
module.exports = ballotController;
module.exports.BallotController = BallotController;
