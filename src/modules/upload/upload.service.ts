import path from 'path';
import { createFileFolderByDate, getFolderNameByDate } from '../../common/utils/index';
import { BadRequest } from '../../errors';
import { Image } from '../../common/types';
import ImageModel from './image.model';
import { Model } from 'sequelize';
import config from '../../../config';

class uploadService {
  async save(file: any) {
    this.saveToLocal(file);

    const result = await this.savaToDb(file);

    return result;
  }

  async savaToDb(file: any, newsId?: number) {
    const fileExtName = file.mimetype.split('/')[1];
    const fileName = file.md5 + '.' + fileExtName;
    const folderName = getFolderNameByDate();

    const result: Model<Image> = await ImageModel.create({
      url: `/images/${folderName}/${fileName}`,
      news_id: newsId,
    });

    return result;
  }

  async saveToLocal(file: any) {
    if (!file.mimetype.startsWith('image')) {
      throw new BadRequest('文件格式错误');
    }

    const fileExtName = file.mimetype.split('/')[1];
    const fileName = file.md5 + '.' + fileExtName;
    const folderName = createFileFolderByDate();

    const imagePath = path.join(config.paths.imagePath, `/${folderName}/${fileName}`);

    await file.mv(imagePath);
  }
}

export default new uploadService();
