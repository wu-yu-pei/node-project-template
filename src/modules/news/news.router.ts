import { Router } from 'express';

import newsController from './news.controller';
import verifyPipe from '../../pipe/verify.pipe';
import { ParamsPosition } from '../../common/enum';

const newRoute = Router();

// 尝试一下 封装参数检验
// 但是 目前只能校验 参数是否必填 和 是否是指定类型，且只能通过中间件的方式来检验
// 写起来 router层 不是很 干净 看着有些 厚重、重复
// TODO 尝试把 参数检验 抽取到 controller层 并且保证controller层 代码的整洁
// TODO 参考@hapi/joi （借助装饰器语法）

newRoute.post('/news', verifyPipe.required(['title', 'type', 'content'], ParamsPosition.BODY), verifyPipe.required(['files'], ParamsPosition.REQ), newsController.createNews);

newRoute.get('/news', verifyPipe.optionalMustNumber(['page', 'pageSize'], ParamsPosition.QUERY), newsController.getNews);

newRoute.get('/news/:id', verifyPipe.mustNumber(['id'], ParamsPosition.PARAMS), newsController.getNewsDetail);

newRoute.put('/news', verifyPipe.required(['id', 'title', 'type', 'content'], ParamsPosition.BODY), verifyPipe.mustNumber(['id'], ParamsPosition.BODY), newsController.updateNews);

newRoute.delete('/news/:id', verifyPipe.mustNumber(['id'], ParamsPosition.PARAMS), newsController.deleteNews);

export default newRoute;
