const { AuthController } = require('../auth.controller');

describe('AuthController helper methods (input -> output)', () => {
  // This test verifies that validateLoginPayload, which is used by login()
  // to validate the incoming credentials, considers a body with both
  // idNumber and password present to be valid and returns no errors.
  test('validateLoginPayload returns valid when idNumber and password are present', () => {
    const controller = new AuthController();

    const body = {
      idNumber: '1001',
      password: 'password1',
    };

    const result = controller.validateLoginPayload(body);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  // This test verifies that buildVoterResponse, which is used by login()
  // to shape the voter object in the JSON response, correctly maps the
  // voter document fields (_id, idNumber, name, email, hasVoted) into
  // the expected DTO structure.
  test('buildVoterResponse maps voter document to response DTO', () => {
    const controller = new AuthController();

    const voterDoc = {
      _id: 'abc123',
      idNumber: '1001',
      name: 'Alice',
      email: 'alice@example.com',
      hasVoted: false,
    };

    const dto = controller.buildVoterResponse(voterDoc);

    expect(dto).toEqual({
      id: 'abc123',
      idNumber: '1001',
      name: 'Alice',
      email: 'alice@example.com',
      hasVoted: false,
    });
  });
});
