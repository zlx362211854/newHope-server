import mongoose from "mongoose";
import { getTime } from "../lib/util";
const ObjectId = mongoose.Schema.Types.ObjectId;

export const enums = {
  status: ["public", "draft"] // 'public'：已发布文章 'draft'：草稿
};

// 文章
const schema = mongoose.Schema({
  postId: ObjectId,
  title: String, // 标题
  author: {type: ObjectId, ref: 'Signup'}, // 关联用户
  content: String, // 内容
  type: { type: String, enums: enums.status }, // 类型 'public'：已发布文章 'draft'：草稿
  deleted: { type: Boolean, default: false },
  create_time: { type: Number, default: getTime },
  update_time: Number
});
export default mongoose.model("Post", schema);
