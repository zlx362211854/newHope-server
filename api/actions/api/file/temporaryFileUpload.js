import mongoose from 'mongoose';
import config from '../../config';
import fs from 'fs';
import {roleAuthPromise} from "../../lib/auth";
const File = mongoose.model('File');
export default async req => {
  await roleAuthPromise(req, 'read', 'post');
  const {file} = req;
  const obj = new File({
    name: file.filename,
    path: file.path,
    size: file.size,
    type: file.mimetype,
    deleted: false
  });
  await obj.save();
  return {
    code: config.code.success,
    data: {
      file: obj
    }
  };
};
