import mongoose from 'mongoose';
import { code } from '../../config';
import { argsFilter } from '../../lib/util';

const Groups = mongoose.model('Groups');

export default async req => {
  const args = await argsFilter(req.body, {
    _id: ['required', 'string'],
    name: ['required', 'string']
  });

  const update = await Groups.findOneAndUpdate(
    { _id: args._id },
    { $set: { group_name: args.name } }
  );
  if (update) {
    return { code: code.success, data: {msg: '重命名成功！'} };
  } else {
    return { code: code.fail };
  }
};
