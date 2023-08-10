import { NextFunction, Request, Response } from 'express';
import { RedisKey, Time } from '../common/enum';
import redisCache from '../cache/redis.cache';
import { generateSignature } from '../common/utils';
import { AuthErrorRequest } from '../errors';
import { BadRequest } from '../errors';
import config from '../../config';

const NONCE_EXPIRY = 60 * 1000;

export default async function (req: Request, res: Response, next: NextFunction) {
  const nonce = req.header('x-nonce');
  const timestamp = req.header('x-timestamp');
  const signature = req.header('x-signature');
  const redisNonceKey = RedisKey.NONCE_KEY + '_' + nonce.toLocaleUpperCase();
  const redisNonceVal = '1';

  if (!nonce || !timestamp || !signature) {
    throw new BadRequest('缺少必要参数');
  }

  if (await redisCache.get(redisNonceKey)) {
    throw new BadRequest('请不要重复请求');
  }

  if (Date.now() - Number(timestamp) > NONCE_EXPIRY) {
    throw new BadRequest('请求过期');
  }

  // 计算 对比 签名
  const expectedSignature = generateSignature(nonce, timestamp, config.secret_key);
  if (signature !== expectedSignature) {
    throw new AuthErrorRequest('无效的签名');
  }

  await redisCache.set(redisNonceKey, redisNonceVal, Time.REDIS_NONCE_TTL);

  next();
}
