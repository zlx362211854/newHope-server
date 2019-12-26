import mongoose from "mongoose";
import { code } from "../../config";
import { argsFilter } from "../../lib/util";

const Signup = mongoose.model("Signup");

export default async req => {
  const args = await argsFilter(req.body, {
    id: ["required", "string"]
  });
  const updatedUser = await Signup.findOneAndUpdate(
    { _id: args.id },
    { $set: { deleted:  true} },
    { new: true }
  );
  return { code: code.success, data: updatedUser };
};
