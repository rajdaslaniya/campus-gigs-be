import * as multer from 'multer';
import { Request } from 'express';

export const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(new Error('Only image files are allowed!'), false);
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
};
