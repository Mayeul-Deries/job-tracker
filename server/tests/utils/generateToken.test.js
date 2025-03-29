import { generateToken } from '../../src/utils/generateToken.js';
import jwt from 'jsonwebtoken';
import { Constants } from '../../src/utils/constants/constants.js';
import { defaultUser } from '../fixtures/userFixture.js';

jest.mock('jsonwebtoken');

describe('generateToken', () => {
  const user = defaultUser;
  const mockToken = 'fakeToken123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Génère un token JWT avec les bons paramètres', () => {
    jwt.sign.mockReturnValue(mockToken);
    const token = generateToken(user._id);

    expect(jwt.sign).toHaveBeenCalledWith({ userId: user._id }, process.env.SECRET_ACCESS_TOKEN, {
      expiresIn: Constants.MAX_DURATION_COOKIE,
    });

    expect(token).toBe(mockToken);
  });
});
