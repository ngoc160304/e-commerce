const OTP_COLECTION_NAME = 'otps';
const OTP_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['userId', 'otp', 'createdAt'],
    properties: {
      userId: {
        bsonType: 'objectId'
      },
      otp: {
        bsonType: 'string'
      },
      createdAt: {
        bsonType: 'date'
      }
    }
  }
};

export const otpModel = {
  OTP_COLECTION_NAME,
  OTP_COLLECTION_SCHEMA
};
