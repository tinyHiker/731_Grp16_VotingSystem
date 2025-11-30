const { VoteService } = require('../vote.service');

describe('VoteService.ensureVoterEligible', () => {
  const service = new VoteService(); // models not used for this helper

  test('throws when voter is null/undefined', () => {
    // This test verifies that passing a missing voter
    // causes "Voter not found" to be thrown.
    expect(() => service.ensureVoterEligible(null)).toThrow('Voter not found');
    expect(() => service.ensureVoterEligible(undefined)).toThrow('Voter not found');
  });

  test('throws when voter.hasVoted is true', () => {
    // This test verifies that a voter who already voted
    // triggers a "Voter has already voted" error.
    const voter = { hasVoted: true };
    expect(() => service.ensureVoterEligible(voter)).toThrow('Voter has already voted');
  });

  test('does not throw when voter exists and hasVoted is false', () => {
    // This test verifies that an eligible voter passes without error.
    const voter = { hasVoted: false };
    expect(() => service.ensureVoterEligible(voter)).not.toThrow();
  });
});

describe('VoteService.ensureElectionOpen', () => {
  const service = new VoteService();

  test('throws when election is null/undefined', () => {
    // This test verifies that a missing election
    // triggers "Election not found".
    expect(() => service.ensureElectionOpen(null)).toThrow('Election not found');
    expect(() => service.ensureElectionOpen(undefined)).toThrow('Election not found');
  });

  test('throws when election.state is not "Open"', () => {
    // This test verifies that a non-open election
    // triggers "Election is not open".
    const election = { state: 'Closed' };
    expect(() => service.ensureElectionOpen(election)).toThrow('Election is not open');
  });

  test('does not throw when election.state is "Open"', () => {
    // This test verifies that an open election passes without error.
    const election = { state: 'Open' };
    expect(() => service.ensureElectionOpen(election)).not.toThrow();
  });
});

describe('VoteService.buildVoteData', () => {
  const service = new VoteService();

  test('builds vote data object with provided values and isValid=true', () => {
    // This test verifies that the helper produces the expected
    // plain object used to create a Vote document.
    const voterId = 'v1';
    const electionId = 'e1';
    const candidateIds = ['c1', 'c2'];
    const sourceIp = '127.0.0.1';
    const createdAt = new Date('2024-01-01T12:00:00Z');

    const voteData = service.buildVoteData(
      voterId,
      electionId,
      candidateIds,
      sourceIp,
      createdAt
    );

    expect(voteData).toEqual({
      voterId,
      electionId,
      candidateIds,
      createdAt,
      isValid: true,
      sourceIp: '127.0.0.1',
    });
  });

  test('uses empty string when sourceIp is falsy', () => {
    // This test verifies that a missing sourceIp is converted
    // to an empty string in the resulting vote data.
    const createdAt = new Date('2024-01-01T12:00:00Z');

    const voteData = service.buildVoteData(
      'v1',
      'e1',
      ['c1'],
      null,
      createdAt
    );

    expect(voteData.sourceIp).toBe('');
  });
});

describe('VoteService.recordVote (happy path)', () => {
  test('fetches voter/election, creates vote, and marks voter as having voted', async () => {
    // This test verifies the happy path of recordVote:
    // - loads voter and election
    // - ensures voter and election are eligible
    // - builds vote data and calls Vote.create
    // - sets voter.hasVoted = true and calls voter.save()

    const voterId = 'v1';
    const electionId = 'e1';
    const candidateIds = ['c1'];
    const sourceIp = '10.0.0.1';

    const voterDoc = {
      _id: voterId,
      hasVoted: false,
      save: jest.fn().mockResolvedValue(true),
    };

    const electionDoc = {
      _id: electionId,
      state: 'Open',
    };

    const createdVoteDoc = {
      _id: 'vote1',
      voterId,
      electionId,
      candidateIds,
      isValid: true,
      sourceIp,
    };

    const mockVoterModel = {
      findById: jest.fn().mockResolvedValue(voterDoc),
    };

    const mockElectionModel = {
      findById: jest.fn().mockResolvedValue(electionDoc),
    };

    const mockVoteModel = {
      create: jest.fn().mockResolvedValue(createdVoteDoc),
    };

    const service = new VoteService(
      mockVoteModel,
      mockVoterModel,
      mockElectionModel
    );

    const result = await service.recordVote(
      voterId,
      electionId,
      candidateIds,
      sourceIp
    );

    expect(mockVoterModel.findById).toHaveBeenCalledWith(voterId);
    expect(mockElectionModel.findById).toHaveBeenCalledWith(electionId);

    expect(mockVoteModel.create).toHaveBeenCalled();
    const passedVoteData = mockVoteModel.create.mock.calls[0][0];
    expect(passedVoteData.voterId).toBe(voterId);
    expect(passedVoteData.electionId).toBe(electionId);
    expect(passedVoteData.candidateIds).toEqual(candidateIds);
    expect(passedVoteData.isValid).toBe(true);
    expect(passedVoteData.sourceIp).toBe(sourceIp || '');

    expect(voterDoc.hasVoted).toBe(true);
    expect(voterDoc.save).toHaveBeenCalled();

    expect(result).toBe(createdVoteDoc);
  });
});
