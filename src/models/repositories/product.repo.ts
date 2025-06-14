import { createObjectId } from '~/utils/format';
import { productModel } from '../product.model';
import mongodb from '~/configs/database';
import { Double, ObjectId } from 'mongodb';
const { PRODUCT_COLECTION_NAME } = productModel;

export interface Product {
  shopId: ObjectId;
  slug: string;
  title: string;
  description: string;
  thumbnails: { position: string; url: string }[];
  video: string;
  sold: number;
  status: string;
  ratingAverage: Double;
  ratingCound: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date | null;
  _destroy: boolean;
}
const getListProduct = async (query: object, limit: number, page: number, project: object) => {
  return await mongodb
    .getDB()
    .collection<Product>(PRODUCT_COLECTION_NAME)
    .find({ _destroy: false, ...query })
    .limit(limit)
    .skip((page - 1) * limit)
    .project({ _destroy: 0, ...project })
    .toArray();
};
const findOneById = async (id: string) => {
  return await mongodb
    .getDB()
    .collection<Product>(PRODUCT_COLECTION_NAME)
    .findOne({
      _id: createObjectId(id),
      _destroy: false
    });
};
const getProductsByUser = async (
  query: object,
  limit: number,
  page: number,
  project: object = {}
) => {
  return await getListProduct(query, limit, page, project);
};
const getProductsBySeller = async (
  query: object,
  limit: number,
  page: number,
  project: object = {}
) => {
  return await getListProduct(query, limit, page, project);
};
const create = async (data: Product) => {
  return await mongodb.getDB().collection<Product>(PRODUCT_COLECTION_NAME).insertOne(data);
};
const update = async (data: Partial<Product>, filter: object) => {
  return await mongodb
    .getDB()
    .collection<Product>(PRODUCT_COLECTION_NAME)
    .findOneAndUpdate(
      {
        ...filter,
        _destroy: false
      },
      { $set: data },
      {
        returnDocument: 'after'
      }
    );
};
const deleteById = async (productId: string, filter?: object) => {
  return await mongodb
    .getDB()
    .collection<Product>(PRODUCT_COLECTION_NAME)
    .updateOne(
      { _id: createObjectId(productId), ...filter },
      {
        $set: {
          _destroy: true
        }
      }
    );
};

export const productRepo = {
  create,
  findOneById,
  update,
  getProductsByUser,
  getProductsBySeller,
  deleteById
};
