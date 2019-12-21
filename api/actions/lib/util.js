import {code} from "../config";
import moment from 'moment';

export const kScheduleDayIndexToKey = [
  'monday_items',
  'tuesday_items',
  'wednesday_items',
  'thursday_items',
  'friday_items',
  'saturday_items'
];

export function randomString() {
  let time = new Date().getTime();
  let suffix = Math.random()
    .toString(36)
    .substring(5);
  return `${time}-${suffix}`;
}

export function getTime() {
  return parseInt(new Date().getTime(), 10);
}

function orderFromDate(time, exact = true) {
  const time2 = moment(time).startOf('month').toDate();
  time2.setDate(1);
  let offset = 0;
  if (time2.getDay() > 1) {
    offset = -1;
  }

  const month = time.getMonth();
  const year = time.getFullYear();
  const firstWeekday = new Date(year, month, 1).getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
  const offsetDate = time.getDate() + firstWeekday - 1;
  const index = 1; // start index at 0 or 1, your choice
  const weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7);
  const week = index + Math.floor(offsetDate / 7);

  let result = 0;
  if (exact || week < 2 + index) {
    result = week + offset;
  } else {
    result = (week === weeksInMonth ? index + 5 : week) + offset;
  }
  return result;
}

export function dateToWeekString(time) {
  const date = time.getDate();
  const day = time.getDay();
  let month = time.getMonth();
  const startDate = moment(time).startOf('week').add(1, 'days').toDate(); // normalize to monday of same week
  let order = orderFromDate(startDate);
  if (day > date) {
    // fix for month which has 5 weeks, it's last week of last month
  } else {
    ++month;
  }
  if (order === 0) {
    order = 4;
  }
  return `${time.getFullYear()}_${month}_${order}`;
}

export function listGenerator(
  req,
  Model,
  extraArgs,
  { populate, deepPopulate, sort } = {}
) {
  return new Promise((resolve, reject) => {
    let skip = parseInt(req.query.skip) || 0;
    let limit = parseInt(req.query.limit) || 20;
    let hospital = req.headers["x-hospital"];
    let args = {};
    if (extraArgs) {
      extraArgs.forEach(looper => {
        if (typeof looper === "string") {
          let value = req.query[looper];
          if (typeof value !== "undefined") {
            args[looper] = value;
          }
        } else if (typeof looper === "object") {
          Object.assign(args, looper);
        } else if (typeof looper === "function") {
          Object.assign(args, looper(req));
        }
      });
    } else {
      args.deleted = false;
      args.hospital = hospital;
    }
    Model.count(args, (error, count) => {
      if (error) {
        reject({ msg: error.message });
      } else {
        if (count === 0) {
          resolve({
            code: code.success,
            data: {
              total: 0,
              data: []
            }
          });
        } else {
          var middle = Model.find(args)
            .select("-__v")
            .skip(skip)
            .limit(limit);
          if (deepPopulate && deepPopulate.length > 0) {
            middle = middle.deepPopulate(deepPopulate);
          }
          if (populate) {
            middle = middle.populate(populate);
          }
          if (sort) {
            middle = middle.sort(sort);
          }
          middle.exec((err, docs) => {
            if (err) {
              console.log(err);
              reject({ msg: "查找失败！" });
            } else {
              resolve({
                code: code.success,
                data: {
                  total: count,
                  data: docs
                }
              });
            }
          });
        }
      }
    });
  });
}

function validatePersonID(id, backInfo = true) {
  const info = {
    year: 1900,
    month: 1,
    day: 1,
    sex: "Male",
    valid: false,
    length: 0
  };
  const initDate = length => {
    info.length = length;
    const a = length === 15 ? 0 : 2; // 15:18
    info.year = parseInt((a ? "" : "19") + id.substring(6, 8 + a), 10);
    info.month = parseInt(id.substring(8 + a, 10 + a), 10) - 1;
    info.day = parseInt(id.substring(10 + a, 12 + a), 10);
    info.sex = id.substring(14, 15 + a) % 2 === 0 ? "Female" : "Male";

    const myDate = new Date();
    const temp = new Date(info.year, info.month, info.day);
    info.age = myDate.getFullYear() - temp.getFullYear();
    if (
      temp.getMonth() > myDate.getMonth() ||
      (temp.getMonth() === myDate.getDay() && temp.getMonth() > myDate.getDay())
    ) {
      info.age -= 1;
    }

    return (
      temp.getFullYear() === info.year &&
      temp.getMonth() === info.month &&
      temp.getDate() === info.day
    );
  };
  const back = () => {
    return backInfo ? info : info.valid;
  };
  if (typeof id !== "string") return back();
  // 18
  if (/^\d{17}[0-9x]$/i.test(id)) {
    if (!initDate(18)) return back();
    id = id.toLowerCase().split("");
    const wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const y = "10x98765432".split("");
    let sum = 0;
    for (let i = 0; i < 17; i++) sum += wi[i] * id[i];
    if (y[sum % 11] === id.pop().toLowerCase()) info.valid = true;
    return back();
  } else if (/^\d{15}$/.test(id)) {
    // 15位
    if (initDate(15)) info.valid = true;
    return back();
  } else {
    return back();
  }
}

async function filterJudge(result, key, superKey, keyString, value) {
  if (result) {
    return value === undefined
      ? { key: superKey }
      : { object: { [key]: value }, key: superKey };
  } else {
    throw { code: code.fail, msg: `参数${keyString}验证失败！` };
  }
}

export function enumFilterCreator(enums) {
  return value => enums.includes(value);
}

export async function argsFilter(args = {}, rules, superKey, keyString) {
  const deleteKeys = [];
  const filterStr = {
    always: () => true, // 我不care它！ ——Chloric
    empty: () => false,
    required: value => typeof value !== "undefined",
    array: Array.isArray,
    int: Number.isInteger,
    string: value => typeof value === "string",
    bool: value => typeof value === "boolean",
    personID: value => validatePersonID(value, false),
    phone(value) {
      const phone = value.toString();
      return phone[0] === "1" && phone.length === 11;
    },
    // id: mongoose.Types.ObjectId.isValid,  // 坑！
    id: value => value.toString().match(/^[0-9a-fA-F]{24}$/),
    undefined() {
      throw { code: code.fail, msg: "未知的验证规则！" };
    }
  };

  const argsChange = {
    boolStr: {
      rule: "bool",
      change(arg) {
        if (arg === "true") {
          return true;
        } else if (arg === "false") {
          return false;
        } else {
          return arg;
        }
      }
    },
    intStr: {
      rule: "int",
      change: parseInt
    }
  };

  const filterType = {
    string: (rule, value, key, keyString, superKey) =>
      filterJudge(
        (filterStr[rule] || filterStr.undefined)(value),
        key,
        superKey,
        keyString,
        value
      ),
    async object(rule, value, key, keyString, superKey) {
      const argsObj =
        value === null
          ? { object: { [key]: value } }
          : await argsFilter(value, rule, key, keyString);
      argsObj.key = superKey;
      return argsObj;
    },
    function: (rule, value, key, keyString, superKey) =>
      filterJudge(rule(value), key, superKey, keyString, value)
  };

  const results = await Promise.all(
    Object.keys(rules).map(key => {
      const superKeyStr = `${keyString ? `${keyString}.` : ""}${key}`;
      if (typeof args[key] === "undefined") {
        if (typeof rules[key] === "object") {
          args[key] = {};
          deleteKeys.push(key);
        } else if (
          rules[key] !== "required" ||
          (Array.isArray(rules[key]) && !rules[key].includes("required"))
        ) {
          rules[key] = "always";
        }
      }

      if (argsChange[rules[key]]) {
        const { rule, change } = argsChange[rules[key]];
        rules[key] = rule;
        args[key] = change(args[key]);
      } else if (Array.isArray(rules[key])) {
        for (const changeRule of rules[key]) {
          if (argsChange[changeRule]) {
            const { rule, change } = argsChange[changeRule];
            rules[key] = rules[key].filter(rule => rule !== changeRule);
            rules[key].push(rule);
            args[key] = change(args[key]);
            break;
          }
        }
      }

      return Array.isArray(rules[key])
        ? Promise.all(
            rules[key].map(rule =>
              filterType[typeof rule](
                rule,
                args[key],
                key,
                superKeyStr,
                superKey
              )
            )
          )
        : filterType[typeof rules[key]](
            rules[key],
            args[key],
            key,
            superKeyStr,
            superKey
          );
    })
  );

  let key;
  console.log(results, 'results')
  const result = results
    .map(result => {
      if (Array.isArray(result)) {
        result.forEach(resultItem => (key = key || resultItem.key));
      } else {
        key = key || result.key;
      }
      return result;
    })
    .filter(
      result =>
        Array.isArray(result)
          ? result.length > 0
          : typeof result.object !== "undefined"
    )
    .map(result => (Array.isArray(result) ? result[0] : result))
    .reduce((resultObject, { object }) => ({ ...resultObject, ...object }), {});
  deleteKeys.forEach(deleteKey => delete result[deleteKey]);
  return key ? { object: { [key]: result } } : result;
}
