import mongoose from 'mongoose';
import { code } from '../../config';
import { argsFilter } from '../../lib/util';
import {roleAuthPromise} from "../../lib/auth";
const Post = mongoose.model('Post');

export default async req => {
  await roleAuthPromise(req, 'read', 'post');
  const args = await argsFilter(req.body, {
    _id: ["required", "string"]
  });
  // const update = await Post.remove({_id: args._id});
  const update = await Post.findOneAndUpdate(
    { _id: args._id },
    { $set: { deleted: true } },
    { new: true }
  );
  if (update) {
    return { code: code.success, data: {msg: '删除成功！'} };
  } else {
    return { code: code.fail };
  }
};
