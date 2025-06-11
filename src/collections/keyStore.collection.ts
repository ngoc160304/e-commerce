import mongodb from '~/configs/database';
import { keyStoreModel } from '~/models/keyStore.model';
const createCollectionKeyStore = async () => {
  try {
    await mongodb.getDB().createCollection(keyStoreModel.KEY_STORE_COLECTION_NAME);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: keyStoreModel.KEY_STORE_COLECTION_NAME,
      validator: keyStoreModel.KEY_STORE_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionKeyStore };
