import express, { Application } from 'express';
import setupMiddleware from './middleware/index';
import config from '../config/index';

async function bootstrap() {
  const app: Application = express();

  await setupMiddleware(app);

  app.listen(config.port, () => {
    console.log(`
  |-> -----------------run success---------------------
  |-> name      : ${config.systemInfo.projectName}
  |-> version   : v${config.systemInfo.version}
  |-> port      : ${config.port}
  |-> env       : ${config.env}
  |-> --------------------------------------------------
  `);
  });
}

bootstrap();
