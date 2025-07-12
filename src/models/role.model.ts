import { ROLE_NAME } from '~/utils/constant';

const ROLE_COLECTION_NAME = 'roles';
const ROLE_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['role', 'description', 'grants', 'createdAt', 'updatedAt', '_destroy'],
    properties: {
      role: {
        bsonType: 'string',
        enum: [...Object.values(ROLE_NAME)]
      },
      description: {
        bsonType: 'string'
      },
      grants: {
        bsonType: 'array',
        minItems: 1,
        uniqueItems: true,
        additionalProperties: false,
        items: {
          bsonType: 'object',
          required: ['action', 'attributes', 'resource'],
          properties: {
            action: {
              bsonType: 'string'
            },
            attributes: {
              bsonType: 'string'
            },
            resource: {
              bsonType: 'objectId'
            }
          }
        }
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

export const roleModel = {
  ROLE_COLECTION_NAME,
  ROLE_COLLECTION_SCHEMA
};
