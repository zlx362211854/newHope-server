import mongoose from 'mongoose';
import { code } from '../../config';
import { argsFilter } from '../../lib/util';
import {roleAuthPromise} from "../../lib/auth";
import {getMemberAndPostsDetails} from './list';
const Groups = mongoose.model("Groups");
export default async req => {
  // await roleAuthPromise(req, 'read', 'post');
  const args = await argsFilter(req.query, {
    _id: ["required", "string"]
  });
  const detail = await Groups.findOne({_id: args._id});
  const detailNew = await getMemberAndPostsDetails([detail])
  return {
    code: code.success,
    data: detailNew[0]
  };
};
