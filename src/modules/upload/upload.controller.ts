import { Request, Response } from 'express';
import uploadService from './upload.service';

class UploadController {
  // 1.上传文件
  async upload(req: Request, res: Response) {
    const file: any = req.files.file;

    const result = await uploadService.save(file);

    return res.status(200).json({ msg: '上传成功', result });
  }
}

export default new UploadController();
