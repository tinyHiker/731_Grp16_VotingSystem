const Election = require('../models/election.model');
const Candidate = require('../models/candidate.model');

// Get the "current" open election and its candidates
async function getCurrentBallot() {
  // For now, pick the first election with state "Open"
  const election = await Election.findOne({ state: 'Open' }).sort({ startTime: 1 });

  if (!election) {
    return null;
  }

  const candidates = await Candidate.find({ electionId: election._id }).sort({
    position: 1,
  });

  return { election, candidates };
}

module.exports = {
  getCurrentBallot,
};
