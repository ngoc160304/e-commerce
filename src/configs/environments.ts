import 'dotenv/config';

const env: {
  APP_PORT: number;
  APP_HOST: string;
  MONGO_URI: string;
  DATABASE_NAME: string;
  BUILD_MODE: string;
  BREVO_API_KEY: string;
  EMAIL_NAME: string;
  EMAIL_ADDRESS: string;
  REDIS_URL: string;
  REDIS_PASSWORD: string;
  REDIS_PORT: number;
  REDIS_NAME: string;
} = {
  APP_PORT: parseInt(process.env.APP_PORT || '3000', 10),
  APP_HOST: process.env.APP_HOST || 'localhost',
  MONGO_URI: process.env.MONGO_URI || '',
  DATABASE_NAME: process.env.DATABASE_NAME || '',
  BUILD_MODE: process.env.BUILD_MODE || '',
  BREVO_API_KEY: process.env.BREVO_API_KEY || '',
  EMAIL_NAME: process.env.EMAIL_NAME || '',
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS || '',
  REDIS_URL: process.env.REDIS_URL || '',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || ''),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  REDIS_NAME: process.env.REDIS_NAME || ''
};
export default env;
