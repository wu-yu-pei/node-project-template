import { globSync } from 'glob';
import config from '../../config';
import path from 'path';

export default async function () {
  const modelFile = globSync('src/modules/**/*.model.ts');
  const models: any = {};

  //1.加载所有 model
  for (let i = 0; i < modelFile.length; i++) {
    const _path = path.resolve(path.join(__dirname, '../../'), modelFile[i]);

    let { default: model } = await import(_path);

    models[model.name] = model;

    console.log(`|-> load model: ${_path}`);
  }

  // 2.处理model 之间的关联关系
  models.news.hasMany(models.images, { sourceKey: 'id', foreignKey: 'news_id', constraints: false });

  models.images.belongsTo(models.news, { foreignKey: 'news_id', targetKey: 'id', constraints: false });
}
