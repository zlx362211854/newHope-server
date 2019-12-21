import mongoose from 'mongoose';
import { code } from '../../config';
import { argsFilter } from '../../lib/util';

const Groups = mongoose.model('Groups');
export default async req => {
  const args = await argsFilter(req.body, {
    _id: ['required', 'string'],
    posts: 'array',
    members: 'array'
  });
  let detail = await Groups.findOne(
    { _id: args._id },
    { posts: 1, members: 1 }
  );
  args.posts &&
    args.posts.forEach(i => {
      if (detail.posts.indexOf(i) === -1) {
        detail.posts.push(i);
      }
    });
  args.members &&
    args.members.forEach(i => {
      if (detail.members.indexOf(i) === -1) {
        detail.members.push(i);
      }
    });

  const update = await Groups.update(
    { _id: args._id },
    {$set: {posts: detail.posts, members: detail.members}},
    { new: true }
  );
  if (update) {
    return { code: code.success };
  } else {
    return { code: code.fail };
  }
};
