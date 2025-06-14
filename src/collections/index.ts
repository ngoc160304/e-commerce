import { createCollectionDiscount } from './discount.collection';
import { createCollectionKeyStore } from './keyStore.collection';
import { createCollectionOtp } from './otp.collection';
import { createCollectionProduct } from './product.collection';
import { createCollectionShop } from './shop.collection';
import { createCollectionUser } from './user.collection';

const initCollections = async () => {
  await createCollectionUser();
  await createCollectionKeyStore();
  await createCollectionProduct();
  await createCollectionOtp();
  await createCollectionShop();
  await createCollectionDiscount();
};
export { initCollections };
