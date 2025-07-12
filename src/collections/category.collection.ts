import mongodb from '~/configs/database';
import { categoryProductModel } from '~/models/categoryProduct.model';
const createCollectionCategoryProduct = async () => {
  try {
    await mongodb.getDB().createCollection(categoryProductModel.CATEGORY_PRODUCT_COLECTION_NAME);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: categoryProductModel.CATEGORY_PRODUCT_COLECTION_NAME,
      validator: categoryProductModel.CATEGORY_PRODUCT_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionCategoryProduct };
