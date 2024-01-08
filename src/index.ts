import express, { Request, Response, NextFunction } from 'express';
import router from './routes/index.route';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from './middleware/middleware';
import logger from './common/logger';

if (process.env.NODE_ENV === 'development') dotenv.config({ path: `${__dirname}/../.env.local` });
else if (process.env.NODE_ENV === 'production') dotenv.config({ path: `${__dirname}/../../.env.local` });

export default class ApiServer {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  public routes() {
    this.app.use('/', router);
    this.app.use((error: Error, request: Request, response: Response, next: NextFunction) =>
      errorHandler(error, request, response, next),
    );
  }

  public start() {
    const port = process.env.PORT;
    this.app.listen(port, () => logger.info(`Server is started`));
  }
}

const apiServer = new ApiServer();

apiServer.start();
