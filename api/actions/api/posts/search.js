import mongoose from 'mongoose';
import { code } from '../../config';
import { argsFilter } from '../../lib/util';
import { getIP, genToken, kExpirePeriod } from '../../lib/auth';
const Post = mongoose.model('Post');
export default async req => {
  const args = await argsFilter(req.query, {
    title: ['required', 'string'],
    author: ['required', 'string']
  });
  if (args.title) {
    const reg = new RegExp(args.title, 'i'); //不区分大小写
    const posts = await Post.find(
      {
        author: args.author,
        deleted: false,
        //多条件匹配
        $or: [{title: {$regex: reg}}]
      },
      {_id: 1, title: 1}
    ).sort({create_time: -1});
    if (!posts) {
      throw {code: code.fail, msg: '用户不存在！'};
    } else {
      return {code: code.success, data: posts};
    }
  };
}
