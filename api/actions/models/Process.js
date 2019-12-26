import mongoose from "mongoose";
import { getTime } from "../lib/util";
const ObjectId = mongoose.Schema.Types.ObjectId;

var Schema = mongoose.Schema;
// Process model
const schema = mongoose.Schema({
  id: ObjectId, // id
  creator: {type: ObjectId, ref: 'Signup'}, // 关联用户id
  title: String, // 标题
  content: String, // 内容
  status: String, // 状态 submitted: 已提交，accepted: 已接收， processing: 处理中， done: 已完成
  files: [{displayName: String, file: {type: Schema.Types.ObjectId, ref: 'File'}}], // 文件列表,关联文件id
  deleted: { type: Boolean, default: false },
  create_time: { type: Number, default: getTime },
  update_time: Number
});

export default mongoose.model("Process", schema);
