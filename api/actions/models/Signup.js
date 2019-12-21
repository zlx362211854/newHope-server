import mongoose from "mongoose";
import { getTime } from "../lib/util";
const ObjectId = mongoose.Schema.Types.ObjectId;
// user申请
const schema = mongoose.Schema({
  role: String, // 角色
  name: String, // name
  pass: String,
  avatar: {type: ObjectId, ref: 'File'}, // 头像id -> file id
  type: { type: String },
  deleted: { type: Boolean, default: false },
  create_time: { type: Number, default: getTime },
  update_time: Number,
  correlate: ObjectId
});

export default mongoose.model("Signup", schema);
