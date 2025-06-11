/* eslint-disable no-console */
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import env from './configs/environments';
import exitHook from 'async-exit-hook';
import cors from 'cors';
import mongoDB from './configs/database';
import corsOptions from './configs/cors';
import { errorHandling } from './middlewares/errorsHandle.middleware';
import { initCollections } from './collections';
import { indexRoute } from './routers';
const API_V1 = '/api/v1';
const app = express();

const START_SERVER = () => {
  // init middleware
  app.use(helmet());
  app.use(compression());
  app.use(morgan('dev'));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.get('/', (req, res) => {
    res.json({
      ok: 'ok'
    });
  });
  app.use(API_V1, indexRoute);
  app.use(errorHandling);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`App is running on http://${env.APP_HOST}:${env.APP_PORT} !`);
  });
  exitHook(() => {
    mongoDB.closeDB();
  });
};
(async () => {
  try {
    await mongoDB.connectDB();
    console.log('Connect database e-commerce success !');
    await initCollections();
    console.log('Init collections success !');
    START_SERVER();
  } catch (error) {
    console.log(error);
    mongoDB.closeDB();
    process.exit(1);
  }
})();
