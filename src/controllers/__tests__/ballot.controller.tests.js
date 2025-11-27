const { BallotController } = require('../ballot.controller');

describe('BallotController.buildBallotResponse', () => {
  test('returns null when ballot is null', () => {
    const controller = new BallotController();
    const result = controller.buildBallotResponse(null, null);

    expect(result).toBeNull();
  });

  test('returns expected structure when ballot and voter are provided', () => {
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

  test('sets voter to null when voter argument is undefined', () => {
    const controller = new BallotController();

    const ballot = {
      election: { _id: 'e1', name: 'Election 1' },
      candidates: [{ _id: 'c1', name: 'Candidate A' }],
    };

    const result = controller.buildBallotResponse(ballot, undefined);

    expect(result).toEqual({
      election: ballot.election,
      candidates: ballot.candidates,
      voter: null,
    });
  });
});

describe('BallotController.handleNoOpenElection', () => {
  test('responds with 404 and error JSON', () => {
    const controller = new BallotController();

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

describe('BallotController.getBallot', () => {
  test('returns 404 when no ballot is available', async () => {
    // Mock BallotService with getCurrentBallot returning null
    const mockService = {
      getCurrentBallot: jest.fn().mockResolvedValue(null),
    };

    const controller = new BallotController(mockService);

    const jsonSpy = jest.fn();
    const statusSpy = jest.fn(() => ({ json: jsonSpy }));

    const req = {
      user: { idNumber: '1001', name: 'Alice' },
    };

    const res = {
      status: statusSpy,
      json: jsonSpy,
    };

    await controller.getBallot(req, res);

    expect(mockService.getCurrentBallot).toHaveBeenCalled();
    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'No open election found' });
  });

  test('returns ballot data and voter when ballot exists', async () => {
    const ballot = {
      election: { _id: 'e1', name: 'Election 1' },
      candidates: [{ _id: 'c1', name: 'Candidate A' }],
    };

    const mockService = {
      getCurrentBallot: jest.fn().mockResolvedValue(ballot),
    };

    const controller = new BallotController(mockService);

    const jsonSpy = jest.fn();
    const statusSpy = jest.fn(() => ({ json: jsonSpy }));

    const req = {
      user: { idNumber: '1001', name: 'Alice' },
    };

    const res = {
      status: statusSpy,
      json: jsonSpy,
    };

    await controller.getBallot(req, res);

    expect(mockService.getCurrentBallot).toHaveBeenCalled();
    // Should send 200 OK by default (no status() call needed)
    expect(statusSpy).not.toHaveBeenCalled();
    expect(jsonSpy).toHaveBeenCalledWith({
      election: ballot.election,
      candidates: ballot.candidates,
      voter: req.user,
    });
  });
});
