const { BallotService } = require('../ballot.service');

describe('BallotService.getCurrentBallot', () => {
  function createServiceWithMocks({ electionResult, candidatesResult }) {
    const sortElectionMock = jest.fn().mockResolvedValue(electionResult);

    const mockElectionModel = {
      findOne: jest.fn().mockReturnValue({
        sort: sortElectionMock,
      }),
    };

    const sortCandidateMock = jest.fn().mockResolvedValue(
      candidatesResult || []
    );

    const mockCandidateModel = {
      find: jest.fn().mockReturnValue({
        sort: sortCandidateMock,
      }),
    };

    const service = new BallotService(mockElectionModel, mockCandidateModel);

    return {
      service,
      mockElectionModel,
      mockCandidateModel,
      sortElectionMock,
      sortCandidateMock,
    };
  }

  test('returns null when no open election is found', async () => {
    const {
      service,
      mockElectionModel,
      mockCandidateModel,
      sortElectionMock,
      sortCandidateMock,
    } = createServiceWithMocks({
      electionResult: null,
      candidatesResult: [],
    });

    const result = await service.getCurrentBallot();

    expect(mockElectionModel.findOne).toHaveBeenCalledWith({ state: 'Open' });
    expect(sortElectionMock).toHaveBeenCalledWith({ startTime: 1 });

    // If no election, Candidate.find() should never be called
    expect(mockCandidateModel.find).not.toHaveBeenCalled();
    expect(sortCandidateMock).not.toHaveBeenCalled();

    expect(result).toBeNull();
  });

  test('returns election and sorted candidates when an open election exists', async () => {
    const electionDoc = {
      _id: 'e1',
      name: 'Election 1',
    };

    const candidateDocs = [
      { _id: 'c1', name: 'Candidate A', position: 1 },
      { _id: 'c2', name: 'Candidate B', position: 2 },
    ];

    const {
      service,
      mockElectionModel,
      mockCandidateModel,
      sortElectionMock,
      sortCandidateMock,
    } = createServiceWithMocks({
      electionResult: electionDoc,
      candidatesResult: candidateDocs,
    });

    const result = await service.getCurrentBallot();

    expect(mockElectionModel.findOne).toHaveBeenCalledWith({ state: 'Open' });
    expect(sortElectionMock).toHaveBeenCalledWith({ startTime: 1 });

    expect(mockCandidateModel.find).toHaveBeenCalledWith({
      electionId: electionDoc._id,
    });
    expect(sortCandidateMock).toHaveBeenCalledWith({ position: 1 });

    expect(result).toEqual({
      election: electionDoc,
      candidates: candidateDocs,
    });
  });
});
