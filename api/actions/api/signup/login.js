import mongoose from 'mongoose';
import { code } from '../../config';
import { argsFilter } from '../../lib/util';
import { kExpirePeriod } from '../../lib/auth';
const Login = mongoose.model('Signup');
export default async req => {
  const args = await argsFilter(req.body, {
    name: ['required', 'string'],
    pass: ['required', 'string']
  });
  const user = await Login.findOne({name: args.name, deleted: false}).populate('avatar', {name: 1}).exec();
  if (!user) {
    throw {code: code.fail, msg: '用户不存在！'};
  } else if (user.pass !== args.pass) {
    throw {code: code.fail, msg: '密码错误！'};
  } else if (user.type == '0') {
    throw {code: code.fail, msg: '该用户未通过审核，请联系管理员'};
  } else {
    req.session.user = user;
    req.session.exp = Date.now() + kExpirePeriod;
    return {
      code: code.success,
      data: {
        user: {
          name: user.name,
          role: user.role,
          create_time: user.create_time,
          _id: user._id,
          avatar: user.avatar && user.avatar.name
        }
      }
    };
  }
};
