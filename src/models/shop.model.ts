import { STATUS } from '~/utils/constant';
import { EMAIL_RULE } from '~/utils/validations';

const SHOP_COLECTION_NAME = 'shops';
const SHOP_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'userId',
      'name',
      'password',
      'slug',
      'description',
      'logoUrl',
      'isVerified',
      'createdAt',
      'updatedAt',
      'infoContact',
      'totalFollowers',
      'status',
      '_destroy'
    ],
    properties: {
      userId: {
        bsonType: 'objectId'
      },
      name: {
        bsonType: 'string'
      },
      password: {
        bsonType: 'string'
      },
      slug: {
        bsonType: 'string'
      },
      description: {
        bsonType: 'string'
      },
      logoUrl: {
        bsonType: ['string', 'null']
      },
      isVerified: {
        bsonType: 'bool'
      },
      infoContact: {
        bsonType: 'object',
        required: ['email'],
        properties: {
          email: {
            bsonType: 'string',
            pattern: EMAIL_RULE
          },
          phone_number: {
            bsonType: 'string'
          }
        }
      },
      status: {
        bsonType: 'string',
        enum: [...Object.values(STATUS)]
      },
      updatedAt: {
        bsonType: ['date', 'null']
      },
      createdAt: {
        bsonType: 'date'
      },
      _destroy: {
        bsonType: 'bool'
      }
    }
  }
};

export const shopModel = {
  SHOP_COLECTION_NAME,
  SHOP_COLLECTION_SCHEMA
};
