import mongoose from "mongoose";
import { getTime } from "../lib/util";
const ObjectId = mongoose.Schema.Types.ObjectId;

var Schema = mongoose.Schema;
// Orgs model
const schema = mongoose.Schema({
  id: ObjectId, // id
  creator: {type: ObjectId, ref: 'Signup'}, // 关联用户id
  name: String, // 标题
  description: String, // 描述
  type: String, // 三种类型 company:公司, department:部门, team:团体
  deleted: { type: Boolean, default: false },
  create_time: { type: Number, default: getTime },
  update_time: Number
});

export default mongoose.model("Orgs", schema);
