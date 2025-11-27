const { AuthController } = require('../auth.controller');

describe('AuthController.validateLoginPayload', () => {
  test('returns invalid when body is missing', () => {
    const controller = new AuthController();
    const result = controller.validateLoginPayload(undefined);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Request body is required');
  });

  test('returns invalid when idNumber is missing', () => {
    const controller = new AuthController();
    const result = controller.validateLoginPayload({ password: 'pw' });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('idNumber is required');
  });

  test('returns invalid when password is missing', () => {
    const controller = new AuthController();
    const result = controller.validateLoginPayload({ idNumber: '1001' });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('password is required');
  });

  test('returns valid when idNumber and password are present', () => {
    const controller = new AuthController();
    const result = controller.validateLoginPayload({
      idNumber: '1001',
      password: 'password1',
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe('AuthController.buildVoterResponse', () => {
  test('returns null when voter is null', () => {
    const controller = new AuthController();
    const dto = controller.buildVoterResponse(null);

    expect(dto).toBeNull();
  });

  test('maps voter document to response DTO', () => {
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
