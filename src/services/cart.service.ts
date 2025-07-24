import { cartRepo } from '~/models/repositories/cart.repo';
import { createObjectId } from '~/utils/format';
import InventoryService from './inventory.service';
import { BAD_REQUEST } from '~/core/errors.response';

class CartService {
  static createCartUser = async (
    data: {
      inventoryId: string;
      quantity: number;
      productId: string;
    },
    userId: string
  ) => {
    const { inventoryId, quantity, productId } = data;
    const inventory = await InventoryService.checkQtyInventory(inventoryId, quantity);
    if (inventory.productId.toString() !== productId) {
      throw new BAD_REQUEST('Product is not valid !');
    }
    await cartRepo.createNew({
      userId: createObjectId(userId),
      products: [
        {
          inventoryId: createObjectId(inventoryId),
          quantity: quantity as number,
          productId: createObjectId(productId)
        }
      ],
      createdAt: new Date(),
      updatedAt: null
    });
  };
  static addToCart = async (
    data: {
      inventoryId: string;
      quantity: number;
      productId: string;
    },
    userId: string
  ) => {
    const { inventoryId, quantity, productId } = data;
    const cartUser = await cartRepo.findOneByUserId(userId);
    if (!cartUser) {
      await this.createCartUser(data, userId);
    } else {
      // kiem tra san pham da co trong gio hang
      const checkProductInCart = cartUser.products.findIndex(
        (item) => item.inventoryId.toString() === inventoryId
      );

      // TH1 san pham chua ton tai
      if (checkProductInCart === -1) {
        const inventory = await InventoryService.checkQtyInventory(inventoryId, quantity);
        if (inventory.productId.toString() !== productId) {
          throw new BAD_REQUEST('Product is not valid !');
        }
        await cartRepo.addProduct(
          {
            inventoryId: createObjectId(inventoryId),
            quantity: quantity,
            productId: createObjectId(productId)
          },
          userId
        );
      } else {
        const newQty = cartUser.products[checkProductInCart].quantity + quantity;
        const inventory = await InventoryService.checkQtyInventory(inventoryId, newQty);
        if (inventory.productId.toString() !== productId) {
          throw new BAD_REQUEST('Product is not valid !');
        }
        await cartRepo.updateQtyProduct(
          {
            inventoryId: createObjectId(inventoryId),
            quantity: newQty
          },
          userId
        );
      }
    }
    return 'Add product successfully !';
  };
  static deleteProductInCart = async (productId: string, userId: string) => {
    // await redisService.hashDelField(`cart:${userId}`, inventoryId);
    await cartRepo.deleteProduct(productId, userId);
    return 'Delete product successfully !';
  };
  static getCartUser = async (userId: string) => {
    const cart = await cartRepo.getCartDetailByUserId(userId);
    return cart;
  };
  static updateCart = async (
    data: {
      inventoryId: string;
      quantity: number;
      productId: string;
    },
    userId: string
  ) => {
    const cartUser = await cartRepo.findOneByUserId(userId);
    if (!cartUser) {
      this.createCartUser(data, userId);
    } else {
      const { inventoryId, quantity, productId } = data;

      const checkProductInCart = cartUser.products.findIndex(
        (item) => item.inventoryId.toString() === inventoryId
      );

      // TH1 san pham chua ton tai
      if (checkProductInCart === -1) {
        const inventory = await InventoryService.checkQtyInventory(inventoryId, quantity);
        if (inventory.productId.toString() !== productId) {
          throw new BAD_REQUEST('Product is not valid !');
        }
        await cartRepo.addProduct(
          {
            inventoryId: createObjectId(inventoryId),
            quantity: quantity,
            productId: createObjectId(productId)
          },
          userId
        );
      } else {
        const inventory = await InventoryService.checkQtyInventory(inventoryId, quantity);
        if (inventory.productId.toString() !== productId) {
          throw new BAD_REQUEST('Product is not valid !');
        }
        await cartRepo.updateQtyProduct(
          {
            inventoryId: createObjectId(inventoryId),
            quantity: quantity
          },
          userId
        );
      }
    }
    return 'Update cart successfully !';
  };
}
export default CartService;
