import { createObjectId } from '~/utils/format';
import { productModel } from '../product.model';
import mongodb from '~/configs/database';
const { PRODUCT_COLECTION_NAME } = productModel;

interface Product {
  title: string;
  descriptions: string;
  thumnmails: { position: string; url: string }[];
  sold: number;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
  _destroy: boolean;
}
const findOneById = async (id: string) => {
  return await mongodb
    .getDB()
    .collection<Product>(PRODUCT_COLECTION_NAME)
    .findOne({
      _id: createObjectId(id),
      _destroy: false
    });
};
const create = async (data: Product) => {
  return await mongodb.getDB().collection<Product>(PRODUCT_COLECTION_NAME).insertOne(data);
};
export const productRepo = {
  create,
  findOneById
};
