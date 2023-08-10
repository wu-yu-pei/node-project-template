import config from '../../config';
import { globSync } from 'glob';
import path from 'path';

export default async function () {
  const schedulerFiles = globSync('src/interval_work/*.ts');

  const schedulerNames = schedulerFiles.map((routerFileName, index) => {
    return routerFileName.split('/').pop().split('.').shift();
  });

  // 加载所有 定时任务
  for (let i = 0; i < schedulerFiles.length; i++) {
    const _path = path.resolve(config.paths.rootPath, schedulerFiles[i]);

    if (config.scheduler[schedulerNames[i]].enable) {
      await import(_path);
      console.log(`|-> load scheduler: ${_path}`);
    } else {
      console.log(`|-> unload scheduler: ${_path}`);
    }
  }
}
