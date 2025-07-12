import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import env from './environments';

const MONGO_URI = env.MONGO_URI;
const DATABASE_NAME = env.DATABASE_NAME;
const mongoClient = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  },
  monitorCommands: true
});

// mongoClient.on('commandStarted', (event) => console.debug(event));
// mongoClient.on('commandSucceeded', (event) => console.debug(event));
// mongoClient.on('commandFailed', (event) => console.debug(event));
class ConnectMongoClient {
  mongoInstance: Db | null;
  constructor() {
    this.mongoInstance = null;
  }
  connectDB = async () => {
    if (!this.mongoInstance) {
      await mongoClient.connect();
      this.mongoInstance = mongoClient.db(DATABASE_NAME);
    }
  };
  getDB = () => {
    if (!this.mongoInstance) {
      throw new Error('Database does not connect !');
    }
    return this.mongoInstance;
  };
  closeDB = async () => {
    await mongoClient.close();
    this.mongoInstance = null;
  };
  mogoClient = () => {
    return mongoClient;
  };
}
const mongodb = new ConnectMongoClient();
export default mongodb;
