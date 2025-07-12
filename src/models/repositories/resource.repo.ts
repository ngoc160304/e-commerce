import mongodb from '~/configs/database';
import { resourceModel } from '../resource.model';
import { createObjectId } from '~/utils/format';
const { RESOURCE_COLECTION_NAME } = resourceModel;
interface Resource {
  description: string;
  createdAt: Date;
  updatedAt: Date | null;
  _destroy: boolean;
}
const findOneById = async (id: string) => {
  return await mongodb
    .getDB()
    .collection<Resource>(RESOURCE_COLECTION_NAME)
    .findOne({
      _id: createObjectId(id),
      _destroy: false
    });
};

const createNew = async (data: Resource) => {
  return await mongodb.getDB().collection<Resource>(RESOURCE_COLECTION_NAME).insertOne(data);
};
export const resourceRepo = {
  createNew,
  findOneById
};
