import { STATUS_ORDER } from '~/utils/constant';

const ORDER_COLECTION_NAME = 'orders';
const ORDER_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'userId',
      'productInfo',
      'shippingAddress',
      'messageForShop',
      'status',
      'createdAt',
      'updatedAt',
      '_destroy'
    ],
    properties: {
      userId: {
        bsonType: 'objectId'
      },
      productInfo: {
        bsonType: 'object',
        required: ['productId', 'shopId', 'variants', 'quantity', 'price', 'discountCode'],
        properties: {
          productId: {
            bsonType: 'objectId'
          },
          shopId: { bsonType: 'objectId' },
          variants: {
            bsonType: ['array', 'null'],
            uniqueItems: true,
            additionalProperties: false,
            items: {
              bsonType: 'object',
              required: ['attribute', 'value'],
              properties: {
                attribute: {
                  bsonType: 'string'
                },
                value: {
                  bsonType: 'string'
                }
              }
            }
          },
          quantity: { bsonType: 'int' },
          price: { bsonType: 'int' },
          discountCode: {
            bsonType: ['string', 'null']
          }
        }
      },
      shippingAddress: {
        bsonType: 'string'
      },
      messageForShop: {
        bsonType: 'string'
      },
      status: {
        bsonType: 'string',
        enum: [...Object.values(STATUS_ORDER)]
      },
      createdAt: {
        bsonType: 'date'
      },
      updatedAt: {
        bsonType: ['date', 'null']
      },
      _destroy: {
        bsonType: 'bool'
      }
    }
  }
};

export const orderModel = {
  ORDER_COLECTION_NAME,
  ORDER_COLLECTION_SCHEMA
};
