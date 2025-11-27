const { ResultsController } = require('../results.controller');

describe('ResultsController helper methods (input -> output)', () => {
  // This test verifies that buildResultsResponse, which is used by viewResults
  // to shape the successful response body, simply returns the same data object
  // it receives when that data is non-null.
  test('buildResultsResponse returns data as-is when provided', () => {
    const controller = new ResultsController();

    const data = {
      election: { _id: 'e1', name: 'Election 1' },
      results: [
        { candidateId: 'c1', name: 'Candidate A', votes: 10 },
        { candidateId: 'c2', name: 'Candidate B', votes: 5 },
      ],
    };

    const result = controller.buildResultsResponse(data);

    // Since the implementation just returns data directly,
    // we expect it to be the exact same object reference.
    expect(result).toBe(data);
  });

  // This test verifies that handleNoOpenElection, which is called by viewResults
  // when no current election/results are available, sets the correct HTTP status
  // code (404) and JSON error body on the response object.
  test('handleNoOpenElection responds with 404 and error JSON', () => {
    const controller = new ResultsController();

    // Create a fake res object with spies for status() and json()
    const jsonSpy = jest.fn();
    const statusSpy = jest.fn(() => ({ json: jsonSpy }));

    const res = {
      status: statusSpy,
      json: jsonSpy,
    };

    controller.handleNoOpenElection(res);

    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'No open election found' });
  });
});
