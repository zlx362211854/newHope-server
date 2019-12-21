import mongoose from 'mongoose';
import { code } from '../../config';
import { cosmosDB } from '../../config';
const db = mongoose.createConnection(cosmosDB, { useMongoClient: true });
const blackList = [];
export default async function (req) {
  const { model, data } = req.body;
  if (model && data && !blackList.includes(model)) {
    const Model = db.model(model);
    await Promise.all(data.map(async ({ _id, ...item }) => {
      let doc = await Model.findById(_id);
      if (!doc) {
        await Model.create(item);
      } else {
        Object.assign(doc, item);
        await doc.save();
      }
      // 不使用update + upset 是因为如果数据错误不会提示
    }));
    model === 'Patient' && console.log(data.length, data.filter(({ deleted }) => !deleted).length);
  }
  return { code: code.success }
}
