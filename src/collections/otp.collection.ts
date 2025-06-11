import mongodb from '~/configs/database';
import { otpModel } from '~/models/otp.model';
const createCollectionOtp = async () => {
  try {
    await mongodb.getDB().createCollection(otpModel.OTP_COLECTION_NAME);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: otpModel.OTP_COLECTION_NAME,
      validator: otpModel.OTP_COLLECTION_SCHEMA
    });
    await mongodb
      .getDB()
      .collection(otpModel.OTP_COLECTION_NAME)
      .createIndex({ createdAt: 1 }, { expireAfterSeconds: 180 });
    await mongodb
      .getDB()
      .collection(otpModel.OTP_COLECTION_NAME)
      .createIndex({ userId: 1 }, { unique: true });
  }
};
export { createCollectionOtp };
