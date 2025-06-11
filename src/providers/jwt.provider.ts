import jwt from 'jsonwebtoken';

const generatePairToken = (payload: object, privateKey: string) => {
  try {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1h'
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days'
    });
    return {
      accessToken,
      refreshToken
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      accessToken: '',
      refreshToken: ''
    };
  }
};

const verifyToken = (token: string, publicKey: string) => {
  try {
    return jwt.verify(token, publicKey);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
export const JwtProvider = {
  generatePairToken,
  verifyToken
};
