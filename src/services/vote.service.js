const Vote = require('../models/vote.model');
const Voter = require('../models/voter.model');
const Election = require('../models/election.model');

async function recordVote(voterId, electionId, candidateIds, sourceIp) {
  const voter = await Voter.findById(voterId);
  if (!voter) throw new Error('Voter not found');
  if (voter.hasVoted) throw new Error('Voter has already voted');

  const election = await Election.findById(electionId);
  if (!election) throw new Error('Election not found');
  if (election.state !== 'Open') throw new Error('Election is not open');

  // Create the vote
  const vote = await Vote.create({
    voterId,
    electionId,
    candidateIds,
    createdAt: new Date(),
    isValid: true,
    sourceIp: sourceIp || '',
  });

  // Mark voter as having voted
  voter.hasVoted = true;
  await voter.save();

  return vote;
}

module.exports = {
  recordVote,
};
