import _ from 'lodash';
import defaultConfig from './default';

const devConfig: any = {
  env: 'dev',
  port: 8888,
};

_.merge(devConfig, defaultConfig);
export default devConfig;
