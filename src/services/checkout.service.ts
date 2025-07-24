import { BAD_REQUEST } from '~/core/errors.response';
import InventoryService from './inventory.service';
import DiscountService from './discount.service';
import { Order } from '~/models/order.model';
import { createObjectId } from '~/utils/format';
import { STATUS } from '~/utils/constant';
import { inventoryRedis } from '~/redis/inventory.redis';
import { Product } from '~/models/product.model';
import { ObjectId } from 'mongodb';
import { orderRepo } from '~/models/repositories/order.repo';

class CheckoutService {
  static review = async (
    data: {
      inventoryId: string;
      quantity: number;
      discountId: string | null;
    }[],
    userId: string
  ) => {
    const result: {
      productInfo: {
        productId: string;
        thumbnail: string;
        title: string;
        shopId: string;
        quantity: number;
        price: number;
        totalAmount: number;
        inventoryId: string;
      };
      discountInfo: {
        code: string;
        name: string;
        userDiscountId: string;
        discountId: string;
      } | null;
    }[] = [];
    for (const item of data) {
      const { discountId, inventoryId, quantity } = item;
      const { price, product, shopId, productId, thumbnail } =
        (await InventoryService.getInventoryDetail(inventoryId)) as {
          price: number;
          product: Product;
          shopId: ObjectId;
          productId: ObjectId;
          thumbnail: string;
        };
      let totalAmount = price * quantity;
      let discountInfo: {
        finalPrice: number;
        code: string;
        name: string;
        userDiscountId: string;
        discountId: string;
      } | null = null;
      if (discountId) {
        discountInfo = await DiscountService.discountAmount(
          {
            discountId,
            price: totalAmount,
            productId: productId.toString(),
            shopId: shopId.toString()
          },
          userId
        );
        totalAmount = discountInfo.finalPrice;
      }
      result.push({
        productInfo: {
          totalAmount,
          inventoryId,
          price,
          productId: productId.toString(),
          quantity,
          shopId: shopId.toString(),
          thumbnail,
          title: product.title
        },
        discountInfo
      });
    }
    return result;
  };
  static createOrder = async (
    data: {
      productId: string;
      inventoryId: string;
      quantity: number;
      discountId: string | null;
      shippingAddress: string;
      messageForShop: string;
    }[],
    userId: string
  ) => {
    const listOrder = await this.review(
      data.map((i) => {
        return {
          inventoryId: i.inventoryId,
          quantity: i.quantity,
          discountId: i.discountId
        };
      }),
      userId
    );
    const newListOrder: Order[] = [];
    for (const [index, order] of listOrder.entries()) {
      const {
        productInfo: { inventoryId, price, productId, quantity, shopId, totalAmount },
        discountInfo
      } = order;
      let lock: boolean;

      if (discountInfo) {
        lock = await inventoryRedis.aquireLock(inventoryId, quantity, discountInfo.userDiscountId);
      } else {
        lock = await inventoryRedis.aquireLock(inventoryId, quantity);
      }
      if (lock === false) {
        throw new BAD_REQUEST('Some products have been updated please return to cart !');
      }
      await inventoryRedis.deleteKey(`${inventoryId}:lock`);
      const newOrder: Order = {
        _destroy: false,
        createdAt: new Date(),
        updatedAt: null,
        messageForShop: data[index].messageForShop,
        productInfo: {
          discountId: discountInfo?.discountId ? createObjectId(discountInfo.discountId) : null,
          inventoryId: createObjectId(inventoryId),
          price,
          productId: createObjectId(productId),
          quantity,
          shopId: createObjectId(shopId),
          totalAmount
        },
        shippingAddress: data[index].shippingAddress,
        status: STATUS.PENDING,
        userId: createObjectId(userId)
      };
      newListOrder.push(newOrder);
    }
    await orderRepo.createNew(newListOrder);

    return 'Create order successfully !';
  };
}
export default CheckoutService;
