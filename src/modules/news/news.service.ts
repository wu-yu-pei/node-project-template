import { Model } from 'sequelize';
import { News } from '../../common/types';
import uploadService from '../upload/upload.service';
import { BadRequest } from '../../errors';
import NewsModel from './news.model';
import ImageModel from '../upload/image.model';
import { redis, sequelize } from '../../database';
import User from '../user/user.model';

class NewsService {
  // 1 创建新闻
  async createNews(title: string, content: string, type: number, file: any): Promise<Model<News>> {
    const res: Model<News> = await NewsModel.create({ title, content, type });

    if (!file.length) file = [file];

    for (let i = 0; i < file.length; i++) {
      await uploadService.saveToLocal(file[i]);
      await uploadService.savaToDb(file[i], res.dataValues.id);
    }

    return res;
  }

  // 2 新闻列表
  async getNews(pageSize: number, page: number): Promise<Model<News>[]> {
    const res: Model<News>[] = await NewsModel.findAll({
      limit: pageSize * 1,
      offset: pageSize * (page - 1),
      where: {
        state: 1,
      },
      include: [ImageModel],
    });

    return res;
  }

  // 3 新闻详情
  async getNewsDetail(id: number): Promise<Model<News>> {
    const news = await getNewsFromDb(id);
    // ------ 法一：数据储存在redis中 redis中的 锁 ------//
    // 1.阅读量 高并发处理
    // const view = await getNewsViewFromRedis(id, news);
    // 2. 金币高并发处理
    // const coins = await getNewsCoinsFromRedis(id, news);

    // news.dataValues.coins = coins;
    // news.dataValues.view = view;

    // return news

    // ------ 法二：数据储存在Mysql中 mysql中的事务 锁 ------//
    // 1.阅读量 高并发处理
    const view = await getNewsViewFromRedis(id, news);

    // 2. 金币 高并发（
    const newsInMysql = await processCoinsFromMysql(id);

    newsInMysql.dataValues.view = view;

    return newsInMysql;
  }

  // 4 删除新闻
  async deleteNews(id: number): Promise<boolean> {
    const res = await NewsModel.update(
      {
        state: 0,
      },
      {
        where: {
          id,
        },
      }
    );

    return res[0] == 1 ? true : false;
  }

  // 5 更新新闻
  async updateNews(id: number, title: string, content: string, type: string): Promise<boolean> {
    const news = await NewsModel.findOne({
      where: {
        id,
        state: 1,
      },
    });

    if (!news) throw new BadRequest('新闻不存在');

    const res = await NewsModel.update(
      {
        title,
        content,
        type,
      },
      {
        where: {
          id,
        },
      }
    );

    return res[0] == 1 ? true : false;
  }
}

// 从数据库获取新闻
async function getNewsFromDb(id: number): Promise<Model<News>> {
  const news: Model<News> = await NewsModel.findOne({
    where: {
      id,
      state: 1,
    },
  });

  if (!news) throw new BadRequest('文章不存在');

  return news;
}

// 从redis中获取 新闻预览数量
async function getNewsViewFromRedis(id: number, news: Model<News>) {
  const key = `news:${id}:view`;

  const redisHasKey = await redis.setnx(key, news.dataValues.view + 1);

  // redis 没有key
  if (!redisHasKey) {
    const newsViewInRedis = await redis.get(key);
    redis.incrby(key, 1);
    return parseInt(newsViewInRedis) + 1;
  } else {
    redis.expire(key, 60 * 5);
  }

  return news.dataValues.view + 1;
}

// 从redis中获取 新闻金币数量 并保存用户
async function getNewsCoinsFromRedis(id: number, news: Model<News>) {
  const key = `news:${id}:coins`;

  // 开启事务
  const multl = redis.multi();
  multl.get(key);
  multl.setnx(key, news.dataValues.coins);
  multl.decrby(key, 1);
  multl.expire(key, 60 * 5);
  multl.sadd(`news:${id}:users`, Math.random());

  // 执行事务
  const res = await multl.exec();

  const coins = res[0][1];

  return +coins - 1;
}

// 从mysql中获取 新闻金币数量 并保存用户
async function processCoinsFromMysql(id) {
  // 开启 事务
  const transaction = await sequelize.transaction({});

  const news: Model<News> = await NewsModel.findOne({
    where: {
      id,
    },
    lock: transaction.LOCK.UPDATE,
    transaction,
    logging: true,
  });

  await NewsModel.update(
    {
      coins: news.dataValues.coins - 1,
    },
    {
      where: {
        id,
      },
      transaction,
      logging: true,
    }
  );

  await User.create(
    {
      u_id: Math.random(),
    },
    {
      transaction,
    }
  );

  // 如果 没有金币 回滚
  if (news.dataValues.coins <= 0) {
    transaction.rollback();
    throw new BadRequest('没有金币了');
  }

  // 否则 提交事务
  await transaction.commit();
  news.dataValues.coins -= 1;
  return news;
}

export default new NewsService();
