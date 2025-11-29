const { ResultsService } = require('../results.service');

describe('ResultsService helper methods (input -> output)', () => {
  // We pass nulls for the models because in these tests we only use
  // the pure helper methods, not the database-dependent ones.
  const service = new ResultsService(null, null, null);

  // This test verifies that buildAggregationPipeline, which is used
  // inside aggregateVotesByCandidate, produces the expected MongoDB
  // aggregation pipeline for a given electionId.
  test('buildAggregationPipeline returns expected pipeline for electionId', () => {
    const electionId = 'e1';

    const pipeline = service.buildAggregationPipeline(electionId);

    expect(pipeline).toEqual([
      { $match: { electionId: 'e1' } },
      { $unwind: '$candidateIds' },
      {
        $group: {
          _id: '$candidateIds',
          count: { $sum: 1 },
        },
      },
    ]);
  });

  // This test verifies that extractCandidateIdsFromRaw, which is used
  // to derive the list of candidate IDs from the aggregation result,
  // returns exactly the _id values from the raw array.
  test('extractCandidateIdsFromRaw returns list of candidate IDs', () => {
    const raw = [
      { _id: 'c1', count: 5 },
      { _id: 'c2', count: 3 },
      { _id: 'c3', count: 1 },
    ];

    const ids = service.extractCandidateIdsFromRaw(raw);

    expect(ids).toEqual(['c1', 'c2', 'c3']);
  });

  // This test verifies that mapResultsToCandidates and buildResultsResponse,
  // which are used together in getCurrentResults, correctly combine
  // candidate documents with their aggregated vote counts and wrap them
  // in the final response object with the election.
  test('mapResultsToCandidates + buildResultsResponse produce expected results object', () => {
    const candidates = [
      { _id: 'c1', name: 'Candidate A', party: 'Blue' },
      { _id: 'c2', name: 'Candidate B', party: 'Green' },
    ];

    const raw = [
      { _id: 'c1', count: 10 },
      { _id: 'c2', count: 5 },
    ];

    const election = { _id: 'e1', name: 'Election 1' };

    const resultsArray = service.mapResultsToCandidates(candidates, raw);
    const response = service.buildResultsResponse(election, resultsArray);

    expect(resultsArray).toEqual([
      {
        candidateId: 'c1',
        name: 'Candidate A',
        party: 'Blue',
        votes: 10,
      },
      {
        candidateId: 'c2',
        name: 'Candidate B',
        party: 'Green',
        votes: 5,
      },
    ]);

    expect(response).toEqual({
      election,
      results: resultsArray,
    });
  });
});
