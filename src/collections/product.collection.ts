import mongodb from '~/configs/database';
import { productModel } from '~/models/product.model';
const createCollectionProduct = async () => {
  try {
    await mongodb.getDB().createCollection(productModel.PRODUCT_COLECTION_NAME);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: productModel.PRODUCT_COLECTION_NAME,
      validator: productModel.PRODUCT_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionProduct };
