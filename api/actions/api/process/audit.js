import mongoose from "mongoose";
import {code} from "../../config";
import {roleAuthPromise} from "../../lib/auth";
const Process = mongoose.model("Process");
export default async req => {
  await roleAuthPromise(req);
  const processList = await Process.find({deleted: false}).populate({
    path: 'creator',
    populate: [
      {
        path: 'avatar'
      },
      {
        path: 'org'
      }
    ]
  }).populate('files.file').populate('conductor').sort({create_time: -1});
  return {code: code.success, data: processList};
};
