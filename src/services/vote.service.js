const Vote = require('../models/vote.model');
const Voter = require('../models/voter.model');
const Election = require('../models/election.model');

class VoteService {
  constructor(voteModel = Vote, voterModel = Voter, electionModel = Election) {
    this.Vote = voteModel;
    this.Voter = voterModel;
    this.Election = electionModel;
  }

  
  ensureVoterEligible(voter) {
    if (!voter) {
      throw new Error('Voter not found');
    }
    if (voter.hasVoted) {
      throw new Error('Voter has already voted');
    }
  }

  
  ensureElectionOpen(election) {
    if (!election) {
      throw new Error('Election not found');
    }
    if (election.state !== 'Open') {
      throw new Error('Election is not open');
    }
  }

  
  buildVoteData(voterId, electionId, candidateIds, sourceIp, createdAt = new Date()) {
    return {
      voterId,
      electionId,
      candidateIds,
      createdAt,
      isValid: true,
      sourceIp: sourceIp || '',
    };
  }

  
  async recordVote(voterId, electionId, candidateIds, sourceIp) {
    const voter = await this.Voter.findById(voterId);
    this.ensureVoterEligible(voter);

    const election = await this.Election.findById(electionId);
    this.ensureElectionOpen(election);

    const voteData = this.buildVoteData(
      voterId,
      electionId,
      candidateIds,
      sourceIp
    );

    const vote = await this.Vote.create(voteData);

    voter.hasVoted = true;
    await voter.save();

    return vote;
  }
}

const voteServiceInstance = new VoteService();


async function recordVote(voterId, electionId, candidateIds, sourceIp) {
  return voteServiceInstance.recordVote(voterId, electionId, candidateIds, sourceIp);
}

module.exports = {
  recordVote,
  VoteService,
  voteServiceInstance,
};
