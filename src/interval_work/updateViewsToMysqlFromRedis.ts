import scheduler from 'node-schedule';
import { Model } from 'sequelize';
import NewsModel from '../modules/news/news.model';
import { redis } from '../database';
import { News } from '../common/types';

const config = {
  NAME: 'updateMysqlNewsViewsFromRedis',
  TIME: '10 * * * * *',
};

scheduler.scheduleJob(config.NAME, config.TIME, async () => {
  console.log('scheduler start: updateMysqlNewsViewsFromRedis');

  const news: Model<News>[] = await NewsModel.findAll();

  for (let i = 0; i < news.length; i++) {
    const newsId = news[i].dataValues.id;
    const key = `news:${newsId}:view`;
    const newsView = await redis.get(key);

    if (!newsView) continue;

    await NewsModel.update(
      {
        view: newsView,
      },
      {
        where: {
          id: newsId,
        },
      }
    );
  }

  console.log('scheduler end: updateMysqlNewsViewsFromRedis');
});
