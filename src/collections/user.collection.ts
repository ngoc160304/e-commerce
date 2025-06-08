import mongodb from '~/configs/database';
import { userModel } from '~/models/user.model';
const createCollectionUser = async () => {
  try {
    await mongodb.getDB().createCollection(userModel.USER_COLECTION_NAME);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err?.cause || '');
    }
  } finally {
    await mongodb.getDB().command({
      collMod: userModel.USER_COLECTION_NAME,
      validator: userModel.USER_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionUser };
