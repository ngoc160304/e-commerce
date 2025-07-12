import { GENDER, ROLE_NAME, STATUS } from '~/utils/constant';
import { EMAIL_RULE } from '~/utils/validations';

const USER_COLECTION_NAME = 'users';
const USER_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'username',
      'email',
      'password',
      'displayName',
      'gender',
      'avatar',
      'status',
      'verifyToken',
      'dateOfBirth',
      'role',
      'createdAt',
      'updatedAt',
      '_destroy'
    ],
    properties: {
      username: {
        bsonType: 'string'
      },
      email: {
        bsonType: 'string',
        pattern: EMAIL_RULE
      },
      phone: {
        bsonType: 'string'
      },
      password: {
        bsonType: 'string'
      },
      displayName: {
        bsonType: 'string'
      },
      gender: {
        bsonType: 'string',
        enum: [...Object.values(GENDER)]
      },
      avatar: {
        bsonType: ['string', 'null']
      },
      status: {
        bsonType: 'string',
        enum: [...Object.values(STATUS)]
      },
      verifyToken: {
        bsonType: ['string', 'null']
      },
      dateOfBirth: {
        bsonType: ['date', 'null']
      },
      role: {
        bsonType: ['string'],
        enum: [...Object.values(ROLE_NAME)]
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

export const userModel = {
  USER_COLECTION_NAME,
  USER_COLLECTION_SCHEMA
};
