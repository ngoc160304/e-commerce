const KEY_STORE_COLECTION_NAME = 'key-stores';
const KEY_STORE_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['userId', 'publicKey', 'refreshToken', 'refreshTokenUses'],
    properties: {
      userId: {
        bsonType: 'objectId'
      },
      publicKey: {
        bsonType: 'string'
      },
      refreshToken: {
        bsonType: ['string', 'null']
      },
      refreshTokenUses: {
        bsonType: 'array',
        items: {
          bsonType: 'string'
        }
      }
    }
  }
};

export const keyStoreModel = {
  KEY_STORE_COLECTION_NAME,
  KEY_STORE_COLLECTION_SCHEMA
};
