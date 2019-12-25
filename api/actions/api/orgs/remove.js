import mongoose from "mongoose";
import {code} from "../../config";
import { argsFilter } from "../../lib/util";
import {roleAuthPromise} from "../../lib/auth";
const Orgs = mongoose.model("Orgs");
export default async req => {
  await roleAuthPromise(req);
  const args = await argsFilter(req.body, {
    id: ["required", "string"]
  });
  const update = await Orgs.findOneAndUpdate(
    { _id: args.id },
    { $set: { deleted: true } },
    { new: true }
  );
  if (update) {
    return { code: code.success, data: {msg: '删除成功！'} };
  } else {
    return { code: code.fail };
  }
};
