import _ from 'lodash';
import defaultConfig from './default';

// pro 环境下 开启定时任务
Object.keys(defaultConfig.scheduler).forEach((key) => {
  defaultConfig.scheduler[key].enable = true;
});

const proConfig: any = {
  env: 'pro',
  port: 3333,
};

_.merge(proConfig, defaultConfig);
export default proConfig;
