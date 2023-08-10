import scheduler from 'node-schedule';
import { Model } from 'sequelize';
import NewsModel from '../modules/news/news.model';
import { redis } from '../database';
import { News } from '../common/types';

const config = {
  NAME: 'updateMysqlNewsCoinsFromRedis',
  TIME: '10 * * * * *',
};

scheduler.scheduleJob(config.NAME, config.TIME, async () => {
  console.log('scheduler start: updateMysqlNewsCoinsFromRedis');

  const news: Model<News>[] = await NewsModel.findAll();

  for (let i = 0; i < news.length; i++) {
    const newsId = news[i].dataValues.id;
    const key = `news:${newsId}:coins`;
    const value = await redis.get(key);

    if (!value) continue;

    await NewsModel.update(
      {
        coins: value,
      },
      {
        where: {
          id: newsId,
        },
      }
    );
  }

  console.log('scheduler end: updateMysqlNewsCoinsFromRedis');
});
