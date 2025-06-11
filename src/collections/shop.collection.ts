import mongodb from '~/configs/database';
import { shopModel } from '~/models/shop.model';
const createCollectionShop = async () => {
  try {
    await mongodb.getDB().createCollection(shopModel.SHOP_COLECTION_NAME);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: shopModel.SHOP_COLECTION_NAME,
      validator: shopModel.SHOP_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionShop };
