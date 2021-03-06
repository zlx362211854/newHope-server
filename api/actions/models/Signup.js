import mongoose from "mongoose";
import { getTime } from "../lib/util";
const ObjectId = mongoose.Schema.Types.ObjectId;
// user申请
const schema = mongoose.Schema({
  role: { type: String, default: 'user' }, // 角色 super_admin: 超级管理员 admin: 管理员 user:用户
  name: String, // name
  pass: String,
  avatar: {type: ObjectId, ref: 'File'}, // 头像id -> file id
  org: {type: ObjectId, ref: 'Orgs'}, // 
  type: { type: String }, // '0': 待审核，'1': 已审核
  deleted: { type: Boolean, default: false },
  create_time: { type: Number, default: getTime },
  update_time: Number,
  correlate: ObjectId
});

export default mongoose.model("Signup", schema);
