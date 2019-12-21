import mongoose from 'mongoose';
import { code } from '../../config';
import { argsFilter } from '../../lib/util';
import {roleAuthPromise} from "../../lib/auth";
const Post = mongoose.model('Post');

export default async req => {
  await roleAuthPromise(req, 'read', 'post');
  const args = await argsFilter(req.query, {
    id: ["required", "string"]
  });
  // 只输出title和content
  const detail = await Post.findOne({_id: args.id, deleted: false}, {title: 1, content: 1});

  return {
    code: code.success,
    data: {
      detail
    }
  };
};
