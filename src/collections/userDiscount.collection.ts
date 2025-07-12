import mongodb from '~/configs/database';
import { userDiscountModel } from '~/models/userDiscount.model';
const createCollectionUserDiscount = async () => {
  try {
    await mongodb.getDB().createCollection(userDiscountModel.USER_DISCOUNT_COLECTION_NAME);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: userDiscountModel.USER_DISCOUNT_COLECTION_NAME,
      validator: userDiscountModel.USER_DISCOUNT_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionUserDiscount };
