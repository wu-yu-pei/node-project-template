import { Request, Response } from 'express';
import { Model } from 'sequelize';
import newsService from './news.service';
import { BadRequest } from '../../errors/index';
import { News, NewsType } from '../../common/types';

class NewsControl {
  // 1 创建新闻
  async createNews(req: Request, res: Response) {
    const { title, type, content } = req.body;
    const { files } = req;

    if (!NewsType[type]) throw new BadRequest('文章类型错误 只可以是[XINWEN,TONGZHI,RENSHI,QUWEN]');

    const result = await newsService.createNews(title, content, NewsType[type], files.files);

    res.status(200).json({ code: 200, msg: '创建成功', data: result });
  }

  // 2 新闻列表
  async getNews(req: Request, res: Response) {
    const { pageSize = 10, page = 1 } = req.query as any;

    const result: Model<News>[] = await newsService.getNews(pageSize, page);

    res.status(200).json({ code: 200, msg: 'OK', data: result });
  }

  // 3 新闻详情
  async getNewsDetail(req: Request, res: Response) {
    const { id } = req.params;

    const result: Model<News> = await newsService.getNewsDetail(Number(id));

    res.status(200).json({ code: 200, msg: 'OK', data: result ? result : null });
  }

  // 4 删除新闻
  async deleteNews(req: Request, res: Response) {
    const { id } = req.params;

    const isDelete = await newsService.deleteNews(Number(id));

    isDelete ? res.status(200).json({ code: 200, msg: '删除成功', data: { id } }) : res.status(200).json({ code: 200, msg: '删除失败, 文章不存在', data: null });
  }

  // 5 更新新闻
  async updateNews(req: Request, res: Response) {
    const { id, title, type, content } = req.body;

    if (!NewsType[type]) throw new BadRequest('文章类型错误 只可以是[XINWEN,TONGZHI,RENSHI,QUWEN]');

    const isUpdate = await newsService.updateNews(Number(id), title, content, NewsType[type]);

    isUpdate ? res.status(200).json({ code: 200, msg: '编辑成功', data: { id } }) : res.status(200).json({ code: 200, msg: '编辑失败 新闻内容未发生改变', data: null });
  }
}

export default new NewsControl();
