const Vote = require('../models/vote.model');
const Candidate = require('../models/candidate.model');
const Election = require('../models/election.model');

class ResultsService {
  constructor(voteModel = Vote, candidateModel = Candidate, electionModel = Election) {
    this.Vote = voteModel;
    this.Candidate = candidateModel;
    this.Election = electionModel;
  }

  
  async findCurrentOpenElection() {
    return this.Election.findOne({ state: 'Open' }).sort({ startTime: 1 });
  }

 
  buildAggregationPipeline(electionId) {
    return [
      { $match: { electionId } },
      { $unwind: '$candidateIds' },
      {
        $group: {
          _id: '$candidateIds',
          count: { $sum: 1 },
        },
      },
    ];
  }


  async aggregateVotesByCandidate(electionId) {
    const pipeline = this.buildAggregationPipeline(electionId);
    return this.Vote.aggregate(pipeline);
  }

  
  extractCandidateIdsFromRaw(raw) {
    return raw.map((r) => r._id);
  }

 
  mapResultsToCandidates(candidates, raw) {
    return candidates.map((c) => {
      const row = raw.find((r) => r._id.toString() === c._id.toString());
      return {
        candidateId: c._id,
        name: c.name,
        party: c.party,
        votes: row ? row.count : 0,
      };
    });
  }

 
  buildResultsResponse(election, results) {
    if (!election) return null;

    return {
      election,
      results,
    };
  }

  
  async getCurrentResults() {
    
    const election = await this.findCurrentOpenElection();
    if (!election) {
      return null;
    }

    
    const raw = await this.aggregateVotesByCandidate(election._id);
    
    const candidateIds = this.extractCandidateIdsFromRaw(raw);
    const candidates = await this.Candidate.find({ _id: { $in: candidateIds } });

    const results = this.mapResultsToCandidates(candidates, raw);

    return this.buildResultsResponse(election, results);
  }
}

const resultsServiceInstance = new ResultsService();


async function getCurrentResults() {
  return resultsServiceInstance.getCurrentResults();
}

module.exports = {
  getCurrentResults,

  
  ResultsService,
  resultsServiceInstance,
};
