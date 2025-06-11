import { BAD_REQUEST } from '~/core/errors.response';
import { productRepo } from '~/models/repositories/product.repo';

class ProductService {
  static createNew = async (data: {
    title: string;
    descriptions: string;
    thumnmails: { position: string; url: string }[];
    sold: number;
    status: string;
  }) => {
    const newProduct = {
      ...data,
      createdAt: new Date(),
      updatedAt: null,
      _destroy: false
    };
    const createNewProduct = await productRepo.create(newProduct);
    if (!createNewProduct) {
      throw new BAD_REQUEST();
    }
    const getNewProduct = await productRepo.findOneById(createNewProduct.insertedId.toString());
    if (!getNewProduct) {
      throw new BAD_REQUEST();
    }
    return {
      ...getNewProduct
    };
  };
}
export default ProductService;
