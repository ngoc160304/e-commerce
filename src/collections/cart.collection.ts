import mongodb from '~/configs/database';
import { cartModel } from '~/models/cart.model';
const createCollectionCart = async () => {
  try {
    await mongodb.getDB().createCollection(cartModel.CART_COLECTION_NAME);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: cartModel.CART_COLECTION_NAME,
      validator: cartModel.CART_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionCart };
