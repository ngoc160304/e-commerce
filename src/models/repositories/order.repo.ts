import { getCollectionOrder, Order } from '../order.model';

const createNew = async (data: Order[]) => {
  return getCollectionOrder().insertMany(data);
};

export const orderRepo = {
  createNew
};
