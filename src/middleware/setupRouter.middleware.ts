import { Application } from 'express';
import { globSync } from 'glob';
import path from 'path';
import config from '../../config';

export default async function (app: Application) {
  const routerFile = globSync('src/modules/**/*.router.ts');
  
  //1.加载所有 router
  for (let i = 0; i < routerFile.length; i++) {
    const _path = path.resolve(path.join(__dirname, '../../'), routerFile[i]);

    const { default: router } = await import(_path);

    app.use(router);

    console.log(`|-> load router: ${_path}`);
  }
}
