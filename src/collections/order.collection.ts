import mongodb from '~/configs/database';
import { orderModel } from '~/models/order.model';
const createCollectionOrder = async () => {
  try {
    await mongodb.getDB().createCollection(orderModel.ORDER_COLECTION_NAME);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: orderModel.ORDER_COLECTION_NAME,
      validator: orderModel.ORDER_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionOrder };
