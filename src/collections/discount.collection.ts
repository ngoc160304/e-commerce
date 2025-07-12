import mongodb from '~/configs/database';
import { discountModel } from '~/models/discount.model';
const createCollectionDiscount = async () => {
  try {
    await mongodb.getDB().createCollection(discountModel.DISCOUNT_COLECTION_NAME);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: discountModel.DISCOUNT_COLECTION_NAME,
      validator: discountModel.DISCOUNT_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionDiscount };
