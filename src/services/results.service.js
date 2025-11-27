const Vote = require('../models/vote.model');
const Candidate = require('../models/candidate.model');
const Election = require('../models/election.model');

async function getCurrentResults() {
  // Find current election (same as ballot)
  const election = await Election.findOne({ state: 'Open' }).sort({ startTime: 1 });

  if (!election) {
    return null;
  }

  // Aggregate votes per candidate
  const raw = await Vote.aggregate([
    { $match: { electionId: election._id } },
    { $unwind: '$candidateIds' },
    {
      $group: {
        _id: '$candidateIds',
        count: { $sum: 1 },
      },
    },
  ]);

  // Map counts to candidate info
  const candidateIds = raw.map((r) => r._id);
  const candidates = await Candidate.find({ _id: { $in: candidateIds } });

  const results = candidates.map((c) => {
    const row = raw.find((r) => r._id.toString() === c._id.toString());
    return {
      candidateId: c._id,
      name: c.name,
      party: c.party,
      votes: row ? row.count : 0,
    };
  });

  return {
    election,
    results,
  };
}

module.exports = {
  getCurrentResults,
};
