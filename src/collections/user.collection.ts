import mongodb from '~/configs/database';
import { userModel } from '~/models/user.model';
const createCollectionUser = async () => {
  try {
    await mongodb.getDB().createCollection(userModel.USER_COLECTION_NAME);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: userModel.USER_COLECTION_NAME,
      validator: userModel.USER_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionUser };
