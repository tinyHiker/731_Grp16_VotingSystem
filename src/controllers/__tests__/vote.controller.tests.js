const { VoteController } = require('../vote.controller');

describe('VoteController helpers (simple input -> output tests)', () => {
  // This test verifies that a valid payload with electionId and non-empty candidateIds[]
  // is considered valid by validateVotePayload, and returns no errors.
  test('validateVotePayload returns valid for correct payload', () => {
    const controller = new VoteController();

    const body = {
      electionId: 'e1',
      candidateIds: ['c1', 'c2'],
    };

    const result = controller.validateVotePayload(body);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  // This test verifies that getSourceIp correctly reads the client IP
  // from the x-forwarded-for header when it is present on the request.
  test('getSourceIp returns x-forwarded-for header when present', () => {
    const controller = new VoteController();

    const req = {
      headers: { 'x-forwarded-for': '1.2.3.4' },
      socket: { remoteAddress: '5.6.7.8' },
    };

    const ip = controller.getSourceIp(req);

    expect(ip).toBe('1.2.3.4');
  });

  // This test verifies that buildSuccessResponse takes a vote object
  // (with an _id field) and produces the expected response DTO
  // with message and voteId.
  test('buildSuccessResponse returns expected message and voteId', () => {
    const controller = new VoteController();

    const vote = { _id: 'v123' };

    const result = controller.buildSuccessResponse(vote);

    expect(result).toEqual({
      message: 'Vote recorded successfully',
      voteId: 'v123',
    });
  });
});
