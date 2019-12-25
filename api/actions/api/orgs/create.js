import mongoose from "mongoose";
import { code } from "../../config";
import { argsFilter } from "../../lib/util";
import {roleAuthPromise} from "../../lib/auth";
const Orgs = mongoose.model("Orgs");
export default async req => {
  const args = await argsFilter(req.body, {
    name: ["required", "string"],
    description: 'string',
    type: 'string'
  });
  await roleAuthPromise(req);
  const {_id: userId} = req.session.user
  const org = await Orgs.findOne({name: args.name})
  if (org) {
    throw { code: code.fail, msg: "该名称已存在！" };
  }
  const orgs = new Orgs({
    ...args,
    creator: userId
  });
  await orgs.save();
  return { code: code.success };
};
