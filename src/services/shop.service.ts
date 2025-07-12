import { BAD_REQUEST, FORBIDDEN } from '~/core/errors.response';
import { shopRepo } from '~/models/repositories/shop.repo';
import { ROLE_NAME, STATUS } from '~/utils/constant';
import { createObjectId, customSlug, unPickData } from '~/utils/format';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { authenticator } from 'otplib';
import { otpRepo } from '~/models/repositories/otp.repo';
import { userRepo } from '~/models/repositories/user.repo';
import { JwtProvider } from '~/providers/jwt.provider';
import { keyStoreRepo } from '~/models/repositories/keyStore.repo';

class ShopService {
  static createNew = async (
    data: {
      name: string;
      description: string;
      infoContact: { email: string; phone_number?: string };
      password: string;
    },
    user: User
  ) => {
    // kiểm tra shop đã tồn tại và trạng thái active
    const shopExist = await shopRepo.findOneByUserId(user.userId);
    if (shopExist) {
      if (shopExist.status === STATUS.ACTIVE) {
        throw new BAD_REQUEST('Account is aleady exist !');
      }
      if (shopExist.status !== STATUS.PENDING) {
        throw new FORBIDDEN('Your account is banned or no longer active !');
      }
    }
    // tạo shop mới
    const newPassowrd = bcrypt.hashSync(data.password, 10);
    const newShop = {
      ...data,
      password: newPassowrd,
      email: user.email,
      userId: createObjectId(user.userId),
      slug: customSlug(data.name),
      logoUrl: null,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: null,

      totalFollowers: 0,
      status: STATUS.PENDING,
      _destroy: false
    };
    const createNewShop = await shopRepo.createNew(newShop);
    if (!createNewShop) {
      throw new BAD_REQUEST();
    }
    // tạo otp xác nhận shop
    const keySecretOtp = crypto.randomBytes(26).toString('hex');
    const newOtp = {
      userId: createObjectId(user.userId),
      otp: authenticator.generate(keySecretOtp),
      createdAt: new Date()
    };
    const createNewOtp = await otpRepo.createNew(newOtp);
    if (!createNewOtp) {
      throw new BAD_REQUEST();
    }
    return unPickData(createNewShop, ['password', 'status', 'isVerified', 'updatedAt', '_destroy']);
  };
  static verifyShop = async ({ otp }: { otp: string }, user: User) => {
    const { userId } = user;
    const getOtpShop = await otpRepo.findOneByUserId(userId);
    if (!getOtpShop) {
      throw new BAD_REQUEST();
    }
    if (getOtpShop.otp !== otp) {
      throw new BAD_REQUEST('OTP is not correct !');
    }
    const updatedUser = await userRepo.update({ role: ROLE_NAME.SELLER }, userId);
    if (!updatedUser) {
      throw new BAD_REQUEST("Cann't verify shop !");
    }
    const updateShop = await shopRepo.updateByUser(
      {
        status: STATUS.ACTIVE,
        isVerified: true
      },
      userId
    );
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
      { email: user.email, userId: user.userId, role: ROLE_NAME.SELLER },
      privateKey
    );
    if (!pairJwtToken) throw new BAD_REQUEST("Cann't login shop !");
    const getKeyStore = await keyStoreRepo.findOneByUserId(userId);
    if (!getKeyStore) {
      throw new BAD_REQUEST();
    }
    const updateKeyUser = await keyStoreRepo.update(
      user.userId,
      {
        refreshToken: pairJwtToken.refreshToken,
        publicKey
      },
      getKeyStore.refreshToken
    );
    if (!updateKeyUser) {
      throw new BAD_REQUEST();
    }
    return { ...updateShop, ...pairJwtToken };
  };
}
export default ShopService;
