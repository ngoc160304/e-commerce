import { BAD_REQUEST } from '~/core/errors.response';
import { productRepo } from '~/models/repositories/product.repo';
import { STATUS } from '~/utils/constant';
import { createObjectId, customSlug, pagination } from '~/utils/format';
import { ParsedQs } from 'qs';
import { Double } from 'mongodb';
class ProductService {
  static createNew = async (
    data: {
      title: string;
      description: string;
      thumbnails: { position: string; url: string }[];
      status: string;
      video: string;
    },
    shopId: string
  ) => {
    const newProduct = {
      ...data,
      slug: customSlug(data.title),
      sold: 0,
      ratingAverage: Double.fromString('0'),
      ratingCound: 0,
      likeCount: 0,
      shopId: createObjectId(shopId),
      createdAt: new Date(),
      updatedAt: null,
      _destroy: false
    };
    const createNewProduct = await productRepo.create(newProduct);
    if (!createNewProduct) {
      throw new BAD_REQUEST("Cann't create product !");
    }
    const getNewProduct = await productRepo.findOneById(createNewProduct.insertedId.toString());
    if (!getNewProduct) {
      throw new BAD_REQUEST("Cann't get product !");
    }
    return {
      ...getNewProduct
    };
  };
  static update = async (
    data: Partial<{
      title: string;
      description: string;
      thumbnails: { position: string; url: string }[];
      status: string;
      video: string;
    }>,
    productId: string,
    shopId: string
  ) => {
    if (!Object.keys(data).length) {
      throw new BAD_REQUEST('Data is empty !');
    }
    const newProduct = {
      ...data,
      updatedAt: new Date()
    };
    const updated = await productRepo.update(newProduct, {
      _id: createObjectId(productId),
      shopId: createObjectId(shopId)
    });
    if (!updated) {
      throw new BAD_REQUEST("Cann't update product !");
    }
    return updated;
  };
  static changesStatus = async (data: { status: string; productId: string }, shopId: string) => {
    if (![STATUS.ACTIVE, STATUS.INACTIVE].includes(data.status))
      throw new BAD_REQUEST('Invalid status !');
    const updatedProd = await productRepo.update(
      { status: data.status },
      {
        _id: createObjectId(data.productId),
        shopId: createObjectId(shopId)
      }
    );
    if (!updatedProd) {
      throw new BAD_REQUEST("Cann't update product !");
    }
    return updatedProd;
  };
  static getListProductForUser = async (params: ParsedQs) => {
    const { limitPage, pageCurrent } = pagination(params);
    const productsList = await productRepo.getProductsByUser(
      { status: STATUS.ACTIVE },
      limitPage,
      pageCurrent,
      {
        status: 0
      }
    );
    return productsList;
  };
  static getListProductForSeller = async (params: ParsedQs, shopId: string) => {
    const { limitPage, pageCurrent } = pagination(params);
    const query = {
      shopId: createObjectId(shopId)
    };
    return await productRepo.getProductsBySeller(query, limitPage, pageCurrent);
  };
  static getListProductForAdmin = async (params: ParsedQs) => {
    const { limitPage, pageCurrent } = pagination(params);
    return await productRepo.getProductsBySeller({}, limitPage, pageCurrent);
  };
  static deleteProduct = async (productId: string, shopId: string) => {
    return await productRepo.deleteById(productId, {
      shopId: createObjectId(shopId)
    });
  };
}
export default ProductService;
