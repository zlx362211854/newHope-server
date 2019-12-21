import mongoose from 'mongoose';
import config from '../../config';
import fs from 'fs';
import { argsFilter } from '../../lib/util';
const File = mongoose.model('File');
const Signup = mongoose.model('Signup');
export default async req => {
  const args = await argsFilter(req.body, {
    userId: ['required', 'string']
  });
  const { file } = req;
  const obj = new File({
    name: file.filename,
    path: file.path,
    size: file.size,
    type: file.mimetype,
    original_name: file.originalname,
    deleted: false
  });
  await obj.save();

  // 获取之前用户的头像id,和avatar
  const user = await Signup.findOne({ _id: args.userId })
    .populate('avatar', { name: 1, path: 1 })
    .exec();
  if (user.avatar) {
    // File中删除之前用户的头像
    await File.remove({ _id: user.avatar._id });
    // 删除图片文件
    if (user.avatar) {
      // 判断文件是否存在
      fs.exists(user.avatar.path, flag => {
        if (flag) {
          fs.unlinkSync(user.avatar.path);
        }
      });
    }
  }
  // 关联新头像id至用户
  await Signup.findOneAndUpdate(
    { _id: args.userId },
    { $set: { avatar: obj._id } },
    { new: true, fields: { avatar: 1 } }
  );
  return {
    code: config.code.success,
    data: {
      name: obj.name
    }
  };
};
