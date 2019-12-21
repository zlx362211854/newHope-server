import mongoose from "mongoose";
import { code } from "../../config";
import { argsFilter } from "../../lib/util";
const User = mongoose.model('Signup');
const Group = mongoose.model("Groups");
const Post = mongoose.model('Post');
export const getMemberAndPostsDetails = async function(groups) {
  const newGroups = [];
  // 将members和posts通过id查出其对应的详情
  for (let j = 0; j < groups.length; j++) {
    const members = groups[j].members;
    const posts = groups[j].posts;
    const group = groups[j];
    group.members = [];
    group.posts = [];
    for (let i = 0; i < members.length; i++) {
      const member = await User.findOne({_id: members[i]}, {_id: 1, name: 1});
      group.members.push(member)
    }
    for (let i = 0; i < posts.length; i++) {
      const post = await Post.findOne({_id: posts[i], deleted: false}, {title: 1, create_time: 1});
      group.posts.push(post)
    }
    // 按时间排序
    // if (group.posts.length > 1) {
    //   group.posts = group.posts.sort((s, t) => s.create_time < t.create_time)
    // }
    newGroups.push(group)
  }
  return newGroups;
}
export default async req => {
  const args = await argsFilter(req.query, {
    creator: ["required", "string"]
  });
  // 自己创建的groups
  const myGroups = await Group.find({creator: args.creator}).sort({create_time: -1}).populate('creator', {name: 1}).exec();
  // 参与的groups
  const participantGroups = await Group.find({members: {$in: [args.creator]}}).sort({create_time: -1}).populate('creator', {name: 1}).exec();
  
 
  const myGroupsNew = await getMemberAndPostsDetails(myGroups)
  const participantGroupsNew = await getMemberAndPostsDetails(participantGroups)
  return {
    code: code.success,
    data: {
      my: myGroupsNew,
      participant: participantGroupsNew
    }
  };
};
