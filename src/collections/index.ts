import { createCollectionUser } from './user.collection';

const initCollections = async () => {
  await createCollectionUser();
};
export { initCollections };
