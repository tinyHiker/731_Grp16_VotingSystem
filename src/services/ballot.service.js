const Election = require('../models/election.model');
const Candidate = require('../models/candidate.model');

class BallotService {
  constructor(electionModel = Election, candidateModel = Candidate) {
    this.Election = electionModel;
    this.Candidate = candidateModel;
  }

  async getCurrentBallot() {
    
    const election = await this.Election.findOne({ state: 'Open' }).sort({
      startTime: 1,
    });

    if (!election) {
      return null;
    }

    const candidates = await this.Candidate.find({
      electionId: election._id,
    }).sort({ position: 1 });

    return { election, candidates };
  }
}


const ballotServiceInstance = new BallotService();


async function getCurrentBallot() {
  return ballotServiceInstance.getCurrentBallot();
}

module.exports = {
  getCurrentBallot,

  BallotService,
  ballotServiceInstance,
};
