import mongoose from 'mongoose';
import { code } from '../../config';
import { argsFilter } from '../../lib/util';
import { getIP, genToken, kExpirePeriod } from '../../lib/auth';
const Login = mongoose.model('Signup');

export default async req => {
  const args = await argsFilter(req.query, {
    name: ['required', 'string']
  });
  if (args.name) {
    const reg = new RegExp(args.name, 'i'); //不区分大小写
    const users = await Login.find(
      {
        //多条件匹配
        $or: [{name: {$regex: reg}}]
      },
      {_id: 1, name: 1}
    ).sort({create_time: -1});
    if (!users) {
      throw {code: code.fail, msg: '用户不存在！'};
    } else {
      return {code: code.success, data: users};
    }
  };
}
