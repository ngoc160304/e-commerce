import 'dotenv/config';

const env: {
  APP_PORT: number;
  APP_HOST: string;
  MONGO_URI: string;
  DATABASE_NAME: string;
  BUILD_MODE: string;
} = {
  APP_PORT: parseInt(process.env.APP_PORT || '3000', 10),
  APP_HOST: process.env.APP_HOST || 'localhost',
  MONGO_URI: process.env.MONGO_URI || '',
  DATABASE_NAME: process.env.DATABASE_NAME || '',
  BUILD_MODE: process.env.BUILD_MODE || ''
};
export default env;
