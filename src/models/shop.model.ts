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
      'email',
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
      email: { bsonType: 'string', pattern: EMAIL_RULE },
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
        required: ['email', 'phone_number'],
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
      totalFollowers: {
        bsonType: 'int'
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
