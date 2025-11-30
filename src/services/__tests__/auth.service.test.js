const { AuthService } = require('../auth.service');

describe('AuthService.validate', () => {
  // helper to build a service instance with a custom mock model
  function createServiceWithVoterMock(mockImplementation) {
    const mockVoterModel = {
      findOne: jest.fn().mockImplementation(mockImplementation),
    };
    return {
      service: new AuthService(mockVoterModel, null, 'test-secret'),
      mockVoterModel,
    };
  }

  test('returns null when voter is not found', async () => {
    // findOne resolves to null
    const { service, mockVoterModel } = createServiceWithVoterMock(() =>
      Promise.resolve(null)
    );

    const result = await service.validate('1001', 'password1');

    expect(mockVoterModel.findOne).toHaveBeenCalledWith({ idNumber: '1001' });
    expect(result).toBeNull();
  });

  test('returns null when voter is not Active', async () => {
    const inactiveVoter = {
      _id: 'abc',
      idNumber: '1001',
      passwordHash: 'password1',
      status: 'Revoked',
    };

    const { service } = createServiceWithVoterMock(() =>
      Promise.resolve(inactiveVoter)
    );

    const result = await service.validate('1001', 'password1');

    expect(result).toBeNull();
  });

  test('returns null when password does not match passwordHash', async () => {
    const voterDoc = {
      _id: 'abc',
      idNumber: '1001',
      passwordHash: 'correct-password',
      status: 'Active',
    };

    const { service } = createServiceWithVoterMock(() =>
      Promise.resolve(voterDoc)
    );

    const result = await service.validate('1001', 'wrong-password');

    expect(result).toBeNull();
  });

  test('returns voter when idNumber, password, and status are valid', async () => {
    const voterDoc = {
      _id: 'abc',
      idNumber: '1001',
      passwordHash: 'password1',
      status: 'Active',
    };

    const { service } = createServiceWithVoterMock(() =>
      Promise.resolve(voterDoc)
    );

    const result = await service.validate('1001', 'password1');

    expect(result).toBe(voterDoc);
  });
});

describe('AuthService.generateToken', () => {
  test('calls jwt.sign with expected payload, secret, and options', () => {
    const fakeVoter = { _id: { toString: () => 'abc123' } };

    // mock jwt library with a spy for sign
    const signMock = jest.fn().mockReturnValue('mock-token');
    const fakeJwtLib = {
      sign: signMock,
    };

    const service = new AuthService(null, fakeJwtLib, 'test-secret');

    const token = service.generateToken(fakeVoter);

    expect(signMock).toHaveBeenCalledWith(
      {
        sub: 'abc123',
        role: 'voter',
      },
      'test-secret',
      { expiresIn: '2h' }
    );
    expect(token).toBe('mock-token');
  });
});
