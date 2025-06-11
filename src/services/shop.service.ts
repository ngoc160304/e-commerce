import { BAD_REQUEST, FORBIDDEN } from '~/core/errors.response';
import { shopRepo } from '~/models/repositories/shop.repo';
import { STATUS } from '~/utils/constant';
import { createObjectId, customSlug } from '~/utils/format';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { authenticator } from 'otplib';
import { otpRepo } from '~/models/repositories/otp.repo';

class ShopService {
  static createNew = async (
    data: {
      name: string;
      description: string;
      info_contact: { email: string; phone_number?: string };
      password: string;
    },
    user: User
  ) => {
    // kiểm tra shop đã tồn tại và trạng thái active
    const shopExist = await shopRepo.findOneByUserId(user.userId);
    if (shopExist) {
      if (shopExist.status === STATUS.ACTIVE) {
        throw new BAD_REQUEST();
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
      userId: createObjectId(user.userId),
      slug: customSlug(data.name),
      logo_url: null,
      is_verified: false,
      createdAt: new Date(),
      updatedAt: null,

      total_followers: 0,
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
    return 'Create new success !';
  };
  static verifyShop = async ({ otp }: { otp: string }, userId: string) => {
    const getOtpShop = await otpRepo.findOneByUserId(userId);
    if (!getOtpShop) {
      throw new BAD_REQUEST();
    }
    if (getOtpShop.otp !== otp) {
      throw new BAD_REQUEST('OTP is not correct !');
    }
    const updateShop = await shopRepo.updateByUser(
      {
        status: STATUS.ACTIVE,
        is_verified: true
      },
      userId
    );

    return { ...updateShop };
  };
}
export default ShopService;
