import devConfig from './development';
import proConfig from './prodation';

export default process.env.NODE_ENV === 'dev' ? devConfig : proConfig;
