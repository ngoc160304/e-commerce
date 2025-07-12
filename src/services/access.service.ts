import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { BAD_REQUEST, CONFLICT, FORBIDDEN, UNAUTHORIZED } from '~/core/errors.response';
import { keyStoreRepo } from '~/models/repositories/keyStore.repo';
import { userRepo } from '~/models/repositories/user.repo';
import { BrevoProvider } from '~/providers/brevo.provider';
import { JwtProvider } from '~/providers/jwt.provider';
import { ROLE_NAME, STATUS } from '~/utils/constant';
import { createObjectId, pickUser } from '~/utils/format';
import { generateKeyPairSync } from '~/utils/generate';
import { redisService } from './redis.service';
import { jwtDecode } from 'jwt-decode';
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
    if (!pairToken) throw new BAD_REQUEST("Cann't log in !");
    const { accessToken, refreshToken } = pairToken;
    // luu key user vao redis
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, keyStore] = await Promise.all([
      redisService.set(
        `rfToken:${payload.userId}`,
        JSON.stringify({
          refreshToken,
          publicKey
        })
      ),
      keyStoreRepo.createNew({
        publicKey,
        refreshToken: accessToken,
        userId: getUser._id,
        refreshTokenUses: []
      })
    ]);
    if (!keyStore) throw new BAD_REQUEST("Cann't log in !");
    return {
      accessToken,
      refreshToken,
      userInfo: pickUser(getUser, ['_id', 'username', 'email', 'displayName', 'avatar', 'role'])
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
    refreshToken,
    clientId
  }: {
    refreshToken: string;
    clientId: string;
  }) => {
    if (!clientId || !refreshToken) throw new UNAUTHORIZED();
    const getKeyRedis = await redisService.get(`rfToken:${clientId}`);
    if (getKeyRedis) {
      const parseKey = JSON.parse(getKeyRedis);
      if (parseKey.refreshToken !== refreshToken) throw new UNAUTHORIZED();
      const { privateKey, publicKey } = generateKeyPairSync();
      const payload = jwtDecode(refreshToken);
      delete payload.exp;
      delete payload.iat;
      if (!Object.keys(payload).length) throw new UNAUTHORIZED();
      const pairToken = JwtProvider.generatePairToken(payload, privateKey);

      if (!pairToken) throw new UNAUTHORIZED();
      await Promise.all([
        keyStoreRepo.update(
          clientId,
          {
            userId: createObjectId(clientId),
            publicKey,
            refreshToken: pairToken.refreshToken
          },
          refreshToken
        ),
        redisService.set(
          `rfToken:${clientId}`,
          JSON.stringify({
            refreshToken: pairToken.refreshToken,
            publicKey
          })
        )
      ]);
      return {
        refreshToken: pairToken.refreshToken,
        accessToken: pairToken.accessToken
      };
    } else {
      const getKey = await keyStoreRepo.findOneByUserId(clientId);
      if (!getKey) throw new UNAUTHORIZED();
      if (getKey.refreshToken !== refreshToken) throw new UNAUTHORIZED();
      const payload = jwtDecode(refreshToken);
      if (!Object.keys(payload).length) throw new UNAUTHORIZED();
      const { privateKey, publicKey } = generateKeyPairSync();
      const pairToken = JwtProvider.generatePairToken(payload, privateKey);
      if (!pairToken) throw new UNAUTHORIZED();
      await keyStoreRepo.update(
        clientId,
        {
          userId: createObjectId(clientId),
          publicKey,
          refreshToken: pairToken.refreshToken
        },
        refreshToken
      );
      await redisService.set(
        `rfToken:${clientId}`,
        JSON.stringify({
          refreshToken: pairToken.refreshToken,
          publicKey
        })
      );

      return {
        refreshToken: pairToken.refreshToken,
        accessToken: pairToken.accessToken
      };
    }
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
