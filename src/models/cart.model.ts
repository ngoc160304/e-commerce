const CART_COLECTION_NAME = 'carts';
const CART_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['userId', 'products', 'createdAt', 'updatedAt'],
    properties: {
      userId: {
        bsonType: 'objectId'
      },
      products: {
        bsonType: ['array'],
        items: {
          bsonType: 'object',
          required: ['productId', 'quantity', 'variants'],
          properties: {
            productId: { bsonType: 'objectId' },
            quantity: { bsonType: 'int' },
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
            }
          }
        }
      },
      createdAt: {
        bsonType: 'date'
      },
      updatedAt: {
        bsonType: ['date', 'null']
      }
    }
  }
};

export const cartModel = {
  CART_COLECTION_NAME,
  CART_COLLECTION_SCHEMA
};
