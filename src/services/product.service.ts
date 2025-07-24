import { isArray, omit } from 'lodash';
import { Double } from 'mongodb';
import { NOT_FOUND } from '~/core/errors.response';
import { Inventory } from '~/models/inventory.model';
import { Product } from '~/models/product.model';
import { inventoryRepo } from '~/models/repositories/inventory.repo';
import { productRepo } from '~/models/repositories/product.repo';
import { createObjectId, customSlug, pagination } from '~/utils/format';
import { ParsedQs } from 'qs';
import { STATUS } from '~/utils/constant';
class ProductService {
  static createNew = async (
    data: {
      title: string;
      description: string;
      thumbnails: { position: string; url: string }[];
      video: string;
      status: string;
      specifications: object;
      inventorys:
        | {
            variants: null;
            stock: number;
            price: number;
            thumbnail: string;
          }
        | {
            variants: { attribute: string; value: string }[];
            stock: number;
            price: number;
            thumbnail: string;
          }[];
    },
    shopId: string
  ) => {
    const newProduct: Product = {
      title: data.title,
      shopId: createObjectId(shopId),
      slug: customSlug(data.title),
      ratingAverage: Double.fromString('0'),
      status: data.status,
      description: data.description,
      thumbnails: data.thumbnails,
      video: data.video,
      specifications: data.specifications,
      createdAt: new Date(),
      updatedAt: null,
      _destroy: false,
      likeCount: 0,
      ratingCount: 0,
      sold: 0
    };
    // const session = mongodb.mogoClient().startSession();
    // session.startTransaction();
    const createdProduct = await productRepo.createNew(newProduct);
    let newInventory: Inventory | Inventory[];
    if (isArray(data.inventorys)) {
      newInventory = data.inventorys.map((item) => {
        return {
          ...item,
          _destroy: false,
          createdAt: new Date(),
          updatedAt: null,
          productId: createdProduct.insertedId,
          shopId: createObjectId(shopId)
        };
      });
    } else {
      newInventory = {
        ...data.inventorys,
        _destroy: false,
        createdAt: new Date(),
        updatedAt: null,
        productId: createdProduct.insertedId,
        shopId: createObjectId(shopId)
      };
    }
    await inventoryRepo.createNew(newInventory);
    // await session.commitTransaction();
    // await session.endSession();
    return 'Create new product successfully !';
  };
  static update = async (
    data: {
      title: string;
      description: string;
      thumbnails: { position: string; url: string }[];
      video: string;
      status: string;
      specifications: object;
      inventorys:
        | {
            variants: null;
            stock: number;
            price: number;
            createdAt: Date;
            updatedAt: Date | null;
            _destroy: boolean;
            thumbnail: string;
          }
        | {
            variants: { attribute: string; value: string }[];
            stock: number;
            price: number;
            createdAt: Date;
            updatedAt: Date | null;
            _destroy: boolean;
            thumbnail: string;
          }[];
    },
    productId: string,
    shopId: string
  ) => {
    const getProduct = await productRepo.findOneById(productId, {
      shopId: createObjectId(shopId)
    });
    if (!getProduct) throw new NOT_FOUND('Product does not found !');
    await productRepo.updateByShop(
      omit(
        {
          ...data,
          slug: customSlug(data.title),
          updatedAt: new Date()
        },
        ['inventorys']
      ),
      productId,
      shopId
    );
    await inventoryRepo.deleteMultiByProductId(productId);
    let newInventory: Inventory | Inventory[];
    if (isArray(data.inventorys)) {
      newInventory = data.inventorys.map((item) => {
        return {
          ...item,
          _destroy: false,
          createdAt: new Date(),
          updatedAt: null,
          productId: createObjectId(productId),
          shopId: createObjectId(shopId)
        };
      });
    } else {
      newInventory = {
        ...data.inventorys,
        _destroy: false,
        createdAt: new Date(),
        updatedAt: null,
        productId: createObjectId(productId),
        shopId: createObjectId(shopId)
      };
    }
    await inventoryRepo.createNew(newInventory);
    return 'update product successfully !';
  };
  static getListProductUser = async (query: ParsedQs) => {
    const { limitPage, pageCurrent } = pagination(query);
    const find: Record<string, string | boolean | object> = {
      _destroy: false,
      status: STATUS.ACTIVE
    };
    if (query.keyWord) {
      find.title = {
        $regex: query.keyWord,
        $option: 'i'
      };
    }
    let sort = {};
    if (query.sortKey && query.sortValue) {
      sort = {
        [`${query.sortKey.toString()}`]: parseInt(query.sortValue.toString(), 10)
      };
    }
    const products = await productRepo.getListProductUser(find, sort, limitPage, pageCurrent);
    return products;
  };
  static changeStatusByShop = async (
    data: {
      status: string;
    },
    productId: string,
    shopId: string
  ) => {
    await productRepo.updateByShop(data, productId, shopId);
    return 'Change status successfully !';
  };
  static deleteProductByShop = async (productId: string, shopId: string) => {
    await productRepo.deleteByShop(productId, shopId);
    await inventoryRepo.deleteMultiByProductId(productId);
    return 'Delete product successfylly !';
  };
}
export default ProductService;
