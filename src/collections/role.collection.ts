import mongodb from '~/configs/database';
import { roleModel } from '~/models/role.model';
const createCollectionRole = async () => {
  try {
    await mongodb.getDB().createCollection(roleModel.ROLE_COLECTION_NAME);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: roleModel.ROLE_COLECTION_NAME,
      validator: roleModel.ROLE_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionRole };
