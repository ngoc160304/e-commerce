import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { BAD_REQUEST, CONFLICT, FORBIDDEN, UNAUTHORIZED } from '~/core/errors.response';
import { KeyStore, keyStoreRepo } from '~/models/repositories/keyStore.repo';
import { userRepo } from '~/models/repositories/user.repo';
import { BrevoProvider } from '~/providers/brevo.provider';
import { JwtProvider } from '~/providers/jwt.provider';
import { ROLE_NAME, STATUS } from '~/utils/constant';
import { createObjectId, pickUser } from '~/utils/format';
import { generateKeyPairSync } from '~/utils/generate';
import { userRedis } from '~/redis/user.redis';
import { jwtDecode } from 'jwt-decode';
import ms from 'ms';
class AccessService {
  static register = async (data: {
    email: string;
    phone?: string;
    gender: string;
    password: string;
  }) => {
    const emailExist = await userRepo.findOneByEmail(data.email);
    if (emailExist) {
      if (emailExist.status === STATUS.PENDING) {
        throw new CONFLICT('Please check your email to verify your account !');
      }
      throw new BAD_REQUEST('Email is already exist !');
    }
    const username = data.email.split('@')[0];
    const newPassowrd = bcrypt.hashSync(data.password, 10);
    const newUser = {
      ...data,
      username: username,
      displayName: username,
      password: newPassowrd,
      status: STATUS.PENDING,
      verifyToken: uuidv4(),
      avatar: null,
      role: ROLE_NAME.CLIENT,
      dateOfBirth: null,
      createdAt: new Date(),
      updatedAt: null,
      _destroy: false
    };
    const userCreated = await userRepo.createNew(newUser);
    if (!userCreated) {
      throw new BAD_REQUEST('Create account falure');
    }
    await BrevoProvider.verifyAccount(newUser.email, newUser.verifyToken);
    return 'Create new user success !';
  };
  static login = async (data: { email: string; password: string }) => {
    const { email, password } = data;
    const getUser = await userRepo.findOneByEmail(email);
    if (!getUser) throw new UNAUTHORIZED('Password or email is not correct !');
    if (getUser.status === STATUS.PENDING)
      throw new BAD_REQUEST('Please check your email to cofirm account !');
    if (getUser.status !== STATUS.ACTIVE) throw new FORBIDDEN('Your account violates our policies');
    if (!bcrypt.compareSync(password, getUser.password))
      throw new UNAUTHORIZED('Password or email is not correct !');
    const { privateKey, publicKey } = generateKeyPairSync();
    const payload = {
      userId: getUser._id.toString(),
      email: getUser.email,
      role: getUser.role
    };
    const pairToken = JwtProvider.generatePairToken(payload, privateKey);
    if (!pairToken) throw new UNAUTHORIZED('Login failed !');
    const { accessToken, refreshToken } = pairToken;
    await keyStoreRepo.createNew({
      publicKey,
      refreshToken,
      userId: createObjectId(getUser._id.toString()),
      refreshTokenUses: []
    });
    await userRedis.setRfToken(
      getUser._id.toString(),
      {
        refreshToken,
        publicKey
      },
      ms('7 days') / 1000
    );
    return {
      accessToken,
      refreshToken,
      user: pickUser(getUser)
    };
  };
  static verifyAccount = async (data: { verifyToken: string }) => {
    const { verifyToken } = data;
    const user = await userRepo.findOneByVerifyToken(verifyToken);
    if (!user) {
      throw new BAD_REQUEST();
    }
    await userRepo.update({ verifyToken: null, status: STATUS.ACTIVE }, user._id.toString());

    return 'Verify account success !';
  };
  // Cập nhật lại nếu refreshtoken lỗi thì throw lỗi để bên clien tự động đăng xuất
  static refreshToken = async ({
    refreshTokenClient,
    clientId
  }: {
    refreshTokenClient: string;
    clientId: string;
  }) => {
    if (!clientId || !refreshTokenClient) throw new UNAUTHORIZED();
    let getKeyRedis = await userRedis.getKeyStore(clientId);
    let payload;
    if (getKeyRedis) {
      console.log('case 1');
      const { refreshToken } = getKeyRedis;
      if (refreshToken !== refreshTokenClient) {
        await userRedis.delKeyStore(clientId);
        await keyStoreRepo.deleteByUserId(clientId);
        throw new UNAUTHORIZED('Refresh token is not valid !');
      }
      payload = jwtDecode(refreshTokenClient);
    } else {
      console.log('case 2');
      getKeyRedis = (await keyStoreRepo.findOneByUserId(clientId)) as KeyStore;
      if (!getKeyRedis) {
        throw new UNAUTHORIZED();
      }
      if (getKeyRedis.refreshToken !== refreshTokenClient) {
        await keyStoreRepo.deleteByUserId(clientId);
        throw new UNAUTHORIZED('Refresh token is not valid !');
      }
      payload = jwtDecode(refreshTokenClient);
    }
    delete payload.iat;
    delete payload.exp;
    const { privateKey, publicKey } = generateKeyPairSync();
    const pairToken = JwtProvider.generatePairToken(payload, privateKey);
    if (!pairToken) {
      throw new BAD_REQUEST();
    }
    await keyStoreRepo.update(
      clientId,
      {
        publicKey,
        refreshToken: pairToken.refreshToken
      },
      refreshTokenClient
    );
    await userRedis.setRfToken(
      clientId,
      {
        publicKey,
        refreshToken: pairToken.refreshToken
      },
      ms('7 days') / 1000
    );
    return {
      accessToken: pairToken.accessToken,
      refreshToken: pairToken.refreshToken
    };
  };
  static logout = async (user: User) => {
    const deleteKeyUser = await keyStoreRepo.deleteByUserId(user.userId);
    if (!deleteKeyUser) {
      throw new BAD_REQUEST();
    }
    return 'Logout success !';
  };
}
export default AccessService;
