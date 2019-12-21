import mongoose from "mongoose";
import { code } from "../../config";
import { argsFilter } from "../../lib/util";

const Post = mongoose.model("Post");

export default async req => {
  const args = await argsFilter(req.body, {
    title: ["required", "string"],
    author: ["required", "string"],
    content: "string"
  });
  const count = await Post.count({
    title: req.body.title
  }).exec();
  if (count) {
    throw { code: code.fail, msg: "文章标题已存在！" };
  }
  args.type = "public";
  const post = new Post(args);
  await post.save();
  return { code: code.success };
};
