import mongoose from 'mongoose';
import {code} from '../../config';
import {argsFilter} from '../../lib/util';
const Orgs = mongoose.model('Orgs');
export default async req => {
  const args = await argsFilter(req.query, {
    name: ['required', 'string']
  });
  if (args.name) {
    const reg = new RegExp(args.name, 'i'); //不区分大小写
    const orgs = await Orgs.find(
      {
        name: {$regex: reg},
        deleted: false,
        //多条件匹配
        // $or: [{name: {$regex: reg}}]
      },
      {_id: 1, name: 1}
    ).sort({create_time: -1});
    return {code: code.success, data: orgs};
  };
}
