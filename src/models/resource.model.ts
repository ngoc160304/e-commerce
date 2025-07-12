const RESOURCE_COLECTION_NAME = 'resources';
const RESOURCE_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'description', 'createdAt', 'updatedAt', '_destroy'],
    properties: {
      name: {
        bsonType: 'string'
      },
      description: {
        bsonType: 'string'
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

export const resourceModel = {
  RESOURCE_COLECTION_NAME,
  RESOURCE_COLLECTION_SCHEMA
};
