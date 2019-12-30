import mongoose from "mongoose";
import { getTime } from "../lib/util";
const ObjectId = mongoose.Schema.Types.ObjectId;

// Process logs model
const schema = mongoose.Schema({
  id: ObjectId, // id
  user: {type: ObjectId, ref: 'Signup'}, // 操作人
  process: {type: ObjectId, ref: 'Process'}, // 关联Process
  type: String, // 日志类型 【create: 创建，assign: 指派给某人，accept: 接收，process: 开始处理，done: 处理完成，delete: 删除, modify: 修改】
  content: String, // 日志内容（admin创建了申请、admin将申请指派给了zlx、zlx接受了任务、zlx开始处理、zlx处理完成、admin删除...）
  create_time: { type: Number, default: getTime }
});

export default mongoose.model("ProcessLog", schema);
