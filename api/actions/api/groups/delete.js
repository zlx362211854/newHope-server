import mongoose from 'mongoose';
import { code } from '../../config';
import { argsFilter } from '../../lib/util';
import {roleAuthPromise} from "../../lib/auth";
const Groups = mongoose.model('Groups');

export default async req => {
  await roleAuthPromise(req, 'read', 'post');
  const args = await argsFilter(req.body, {
    _id: ["required", "string"]
  });
  const update = await Groups.remove({_id: args._id});
  if (update) {
    return { code: code.success, data: {msg: '删除成功！'} };
  } else {
    return { code: code.fail };
  }
};
