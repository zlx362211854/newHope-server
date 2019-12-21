import mongoose from 'mongoose';
import { code } from '../../config';
import { argsFilter } from '../../lib/util';

const Post = mongoose.model('Post');

export default async req => {
  const args = await argsFilter(req.body, {
    _id: ['required', 'string'],
    title: ['required', 'string'],
    content: 'string'
  });
  const count = await Post.count({
    _id: args._id
  }).exec();
  if (count <= 0) {
    throw { code: code.fail, msg: '文章不存在！' };
  }
  const update = await Post.findOneAndUpdate(
    { _id: args._id },
    { $set: { content: args.content, title: args.title } },
    { new: true, fields: { title: 1, content: 1, _id: 1, author: 1 } }
  );
  if (update) {
    return { code: code.success, data: update };
  } else {
    return { code: code.fail };
  }
  // Post.where({ _id: args.id }).update({ $set: { title: 'words' }})
};
