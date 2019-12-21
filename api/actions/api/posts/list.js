import mongoose from 'mongoose';
import { code } from '../../config';
import { argsFilter } from '../../lib/util';
import {roleAuthPromise} from "../../lib/auth";
const Post = mongoose.model('Post');

export default async req => {
  const {_id} = req.session.user
  await roleAuthPromise(req, 'read', 'post');
  // 不输出content
  const docs = await Post.find({author: _id, deleted: false}, {content: 0}).sort({create_time: -1});

  return {
    code: code.success,
    data: {
      docs
    }
  };
};
