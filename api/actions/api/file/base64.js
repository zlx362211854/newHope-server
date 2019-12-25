import mongoose from "mongoose";
import {code} from "../../config";
import {argsFilter} from "../../lib/util";
import uuid from "uuid/v4";
import fs from 'fs';
import path from "path";
import Base64File from "js-base64-file";
const File = mongoose.model("File");
const image = new Base64File();
const kFileFolder = path.join(__dirname, "../../../uploads/");

export default async function(req) {
  const {base64, id, type} = await argsFilter(req.body, {
    base64: ["required", "string"],
    id: ["required", "string"],
    type: "string"
  });
  const base64Str = base64.split(",")[1];
  const name = `${uuid().toString()}.jpeg`;
  await image.save(base64Str, kFileFolder, name);
  const file = new File({type});
  file.name = name;
  file.deleted = false;
  await file.save();
  const temporaryFile = await File.findOne({_id: id}).exec();
  // 删除修改之前的临时文件
  await File.remove({_id: id});
  fs.unlink(kFileFolder + temporaryFile.name, function(error) {
    if (error) {
      console.log(error);
      return false;
    }
  })

  return {code: code.success, data: file};
}
