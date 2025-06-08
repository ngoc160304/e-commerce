import { GENDER, ROLE_NAME, STATUS } from '~/utils/constant';
import { EMAIL_RULE } from '~/utils/validations';

const USER_COLECTION_NAME = 'users';
const USER_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    title: 'Student Object Validation',
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
      'roles',
      'createdAt',
      'updatedAt'
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
      roles: {
        bsonType: 'array',
        items: {
          bsonType: 'string',
          enum: [...Object.values(ROLE_NAME)]
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

export const userModel = {
  USER_COLECTION_NAME,
  USER_COLLECTION_SCHEMA
};
