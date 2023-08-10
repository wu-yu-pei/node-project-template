export enum NewsType {
  XINWEN = '新闻资讯',
  TONGZHI = '通知公告',
  RENSHI = '人事变动',
  QUWEN = '趣闻乐事',
}

export enum Time {
  REDIS_NEWS_LIST_TTL = 60 * 60 * 24,
  NODE_CACHE_NEWS_LIST_TTL = 60,
  REDIS_NONCE_TTL = 60,
}

export enum ParamsPosition {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',
  REQ = 'req',
}

export enum RedisKey {
  NONCE_KEY = 'NONCE',
}
