import express, { Application } from 'express';
import path from 'path';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import 'express-async-errors';
import cors from 'cors';

import setupRouterMiddleware from './setupRouter.middleware';
import errorHandlerMiddleware from './errorHandler.middleware';
import notFoundMiddleware from './notFond.middleware';
import setupModelMiddleware from './setupModel.middleware';
import setupSchedulerMiddleware from './setupScheduler.middleware';
import replayMiddleware from './replay.middleware';
import config from '../../config';

export default async function (app: Application) {
  app.use(cors());

  app.use(express.static(config.paths.staticPath));

  app.use(
    fileUpload({
      createParentPath: true,
      useTempFiles: false,
    })
  );

  app.use(bodyParser.json());

  // setup model
  await setupModelMiddleware();

  // api 防重放
  app.use(replayMiddleware);

  // setup router
  await setupRouterMiddleware(app);

  // setup scheduler
  await setupSchedulerMiddleware();

  // api not found middleware
  app.use(notFoundMiddleware);

  // error handle middleware
  app.use(errorHandlerMiddleware);
}
