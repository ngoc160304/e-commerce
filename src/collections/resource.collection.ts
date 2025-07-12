import mongodb from '~/configs/database';
import { resourceModel } from '~/models/resource.model';
const createCollectionResource = async () => {
  try {
    await mongodb.getDB().createCollection(resourceModel.RESOURCE_COLECTION_NAME);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: resourceModel.RESOURCE_COLECTION_NAME,
      validator: resourceModel.RESOURCE_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionResource };
