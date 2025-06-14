import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';
import { BAD_REQUEST, CONFLICT, FORBIDDEN, UNAUTHORIZED } from '~/core/errors.response';
import { keyStoreRepo } from '~/models/repositories/keyStore.repo';
import { userRepo } from '~/models/repositories/user.repo';
import { BrevoProvider } from '~/providers/brevo.provider';
import { JwtProvider } from '~/providers/jwt.provider';
import { ROLE_NAME, STATUS } from '~/utils/constant';
import { pickUser } from '~/utils/format';

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
      role: ROLE_NAME.ADMIN,
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
    const user = await userRepo.findOneByEmail(email);
    if (!user) {
      throw new UNAUTHORIZED('Email or password is not correct !');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UNAUTHORIZED('Email or password is not correct !');
    }
    if (user.status === STATUS.PENDING) {
      throw new BAD_REQUEST('Please check your mail to verify your email address !');
    }
    if (user.status !== STATUS.ACTIVE) {
      throw new FORBIDDEN('Account does not have access !');
    }
    const keyUser = await keyStoreRepo.findOneByUserId(user._id.toString());
    if (keyUser) {
      throw new BAD_REQUEST();
    }
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    const pairJwtToken = JwtProvider.generatePairToken(
      {
        email,
        userId: user._id,
        role: user.role
      },
      privateKey
    );
    const newKeyStore = await keyStoreRepo.createNew({
      publicKey: publicKey,
      refreshToken: pairJwtToken.refreshToken,
      userId: user._id,
      refreshTokenUses: []
    });
    if (!newKeyStore) {
      throw new BAD_REQUEST("Cann'ot create new record !");
    }
    return {
      ...pairJwtToken,
      ...pickUser(user, ['email', 'displayName', 'avatar', 'gender', 'role'])
    };
  };
  static verifyAccount = async (data: { verifyToken: string }) => {
    const { verifyToken } = data;
    const user = await userRepo.findOneByVerifyToken(verifyToken);
    if (!user) {
      throw new BAD_REQUEST();
    }
    const verify = await userRepo.update({ verifyToken: null });
    if (!verify) {
      throw new BAD_REQUEST();
    }
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
    if (!clientId || !refreshToken) {
      throw new UNAUTHORIZED();
    }
    const keyUser = await keyStoreRepo.findOneByUserId(clientId);
    if (!keyUser) {
      throw new UNAUTHORIZED();
    }
    if (keyUser.refreshToken !== refreshToken) {
      throw new UNAUTHORIZED();
    }
    if (keyUser.refreshTokenUses.some((r) => r === refreshToken)) {
      throw new UNAUTHORIZED();
    }
    const user = await userRepo.findOneById(clientId);
    if (!user) {
      throw new UNAUTHORIZED();
    }
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    const pairJwtToken = JwtProvider.generatePairToken(
      { email: user.email, userId: user._id, role: user.role },
      privateKey
    );
    const updateKeyUser = await keyStoreRepo.update(
      user._id.toString(),
      {
        refreshToken: pairJwtToken.refreshToken,
        publicKey
      },
      refreshToken
    );
    if (!updateKeyUser) {
      throw new BAD_REQUEST();
    }

    return {
      ...pairJwtToken
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
