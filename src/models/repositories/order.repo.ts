import { createObjectId } from '~/utils/format';
import { orderModel } from '../order.model';
import mongodb from '~/configs/database';
import { ObjectId } from 'mongodb';
const { ORDER_COLECTION_NAME } = orderModel;
export interface Order {
  userId: ObjectId;
  productInfo: {
    productId: ObjectId;
    variants: { attribute: string; value: string }[] | null;
    quantity: number;
    price: number;
    shopId: ObjectId;
    discountCode: string | null;
  };
  shippingAddress: string;
  messageForShop: string;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
  _destroy: boolean;
}
const findOneById = async (id: string) => {
  return await mongodb
    .getDB()
    .collection<Order>(ORDER_COLECTION_NAME)
    .findOne({
      _id: createObjectId(id),
      _destroy: false
    });
};
const getListOrderByUser = async (userId: string) => {
  return await mongodb
    .getDB()
    .collection<Order>(ORDER_COLECTION_NAME)
    .findOne({
      userId: createObjectId(userId),
      _destroy: false
    });
};
const getOrderDetailByUser = async (orderId: string, userId: string) => {
  return await mongodb
    .getDB()
    .collection<Order>(ORDER_COLECTION_NAME)
    .findOne({
      userId: createObjectId(userId),
      _destroy: false
    });
};
const createNew = async (data: Order[]) => {
  return await mongodb.getDB().collection<Order>(ORDER_COLECTION_NAME).insertMany(data);
};
const update = async (data: Partial<Order>, orderId: string, filter = {}) => {
  return await mongodb
    .getDB()
    .collection<Order>(ORDER_COLECTION_NAME)
    .updateOne(
      {
        _id: createObjectId(orderId),
        _destroy: false,
        ...filter
      },
      {
        $set: data
      }
    );
};
export const orderRepo = {
  findOneById,
  createNew,
  getListOrderByUser,
  getOrderDetailByUser,
  update
};
