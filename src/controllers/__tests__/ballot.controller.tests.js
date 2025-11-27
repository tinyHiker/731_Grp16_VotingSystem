const { BallotController } = require('../ballot.controller');

describe('BallotController helper methods (input -> output)', () => {
  // This test verifies that buildBallotResponse, which is used by getBallot
  // to construct the successful JSON response, returns an object that
  // correctly combines the election, candidates, and voter that are provided.
  test('buildBallotResponse returns expected structure for ballot + voter', () => {
    const controller = new BallotController();

    const ballot = {
      election: { _id: 'e1', name: 'Election 1' },
      candidates: [
        { _id: 'c1', name: 'Candidate A' },
        { _id: 'c2', name: 'Candidate B' },
      ],
    };

    const voter = { idNumber: '1001', name: 'Alice' };

    const result = controller.buildBallotResponse(ballot, voter);

    expect(result).toEqual({
      election: ballot.election,
      candidates: ballot.candidates,
      voter,
    });
  });

  // This test verifies that handleNoOpenElection, which is called by getBallot
  // when there is no open election/ballot, sets the HTTP status code to 404
  // and sends the expected JSON error body on the response object.
  test('handleNoOpenElection responds with 404 and error JSON', () => {
    const controller = new BallotController();

    // Fake Express response with spies so we can assert the calls.
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

