import mongoose from "mongoose";
import { code } from "../../config";
import { argsFilter } from "../../lib/util";
import uuid from "uuid/v4";
import path from "path";
import Base64File from "js-base64-file";
const File = mongoose.model("File");
const image = new Base64File();
const kFileFolder = path.join(__dirname, "../../uploads/");

export default async function(req) {
  const { base64, args } = await argsFilter(req.body, {
    base64: ["required", "string"],
    type: ["required", "string"],
    original_name: ["required", "string"],
    size: ["required", "int"]
  });
  const base64Str = base64.split(",")[1];
  const name = `${uuid().toString()}.jpeg`;
  await image.save(base64Str, kFileFolder, name);
  const file = new File(args);
  file.name = name;
  file.deleted = false;
  await file.save();
  return { code: code.success, data: file };
}
