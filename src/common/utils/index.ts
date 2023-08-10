import fs from 'fs';
import path from 'path';
import config from '../../../config';
import crypto from 'crypto';

export function generationNewsData() {
  return new Array(20).fill(0).map((_, index) => {
    return {
      id: index,
      title: `新闻${index + 1}`,
      content: `巴奴发布内容${index + 1}`,
      type: 'news',
      create_time: +new Date(),
      updata_time: +new Date(),
    };
  });
}

export function isNumber(val) {
  // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
  if (val === '' || val == null) {
    return false;
  }

  if (!isNaN(val)) {
    return true;
  } else {
    return false;
  }
}

export function createFileFolderByDate() {
  const targetFolder = getFolderNameByDate();

  const dirs = fs.readdirSync(config.paths.imagePath);

  if (!dirs.includes(targetFolder)) {
    fs.mkdirSync(path.join(config.paths.imagePath, `/${targetFolder}`));
  }

  return targetFolder;
}

export function getFolderNameByDate() {
  const date = new Date();
  const dates = [date.getFullYear(), (date.getMonth() + 1 + '').padStart(2, '0'), (date.getDate() + '').padStart(2, '0')];
  return dates.join('-');
}

export function MD5_ENCODE(str) {
  const md5 = crypto.createHash('md5');
  return md5.update(str).digest('hex');
}

export function generateSignature(nonce: string, timestamp: string | number, secretKey: string) {
  return MD5_ENCODE(MD5_ENCODE(nonce + secretKey + timestamp))
    .split('')
    .reverse()
    .join('');
}
