import log4js from "log4js";
import express from "express";
import session from "express-session";
const RedisStore = require("connect-redis")(session);
import redis from "redis";
import bodyParser from "body-parser";
import config from "./config";
import * as actions from "./actions/index";
import { mapUrl } from "utils/url.js";
import multer from "multer";
import PrettyError from "pretty-error";
import http from "http";
import SocketIo from "socket.io";
import mongoose from "mongoose";
import path from "path";
import dbConfig from "./actions/config";
import { randomString } from "./actions/lib/util";
import kueCreator from "./kue";
import kit from 'utils/kit.js';
function appLoader() {
  console.log("----start to load server------");
  const {dbUser, dbPass, secretKey, dbHost, dbPort, dbName} = dbConfig;
  // const pass = kit.decryptDES(dbPass, secretKey);
  mongoose.connect(dbConfig.db)
  // mongoose.connect("mongodb://" + dbUser + ":" + pass + "@" + dbHost + ":" + dbPort + "/" + dbName);
  mongoose.Promise = global.Promise;
  const log = log4js.getLogger("app");
  const redisClient = redis.createClient(config.redis.port, config.redis.host);
  redisClient.auth('DAxiao123', function() {
    console.log('redis server connect success!')
  })
  const pretty = new PrettyError();
  const app = express();

  const server = new http.Server(app);
  const io = new SocketIo(server);
  io.path("/ws");

  log4js.configure({
    appenders: [
      { type: "console" },
      {
        type: "file",
        filename: "./logs/errors.log",
        pattern: "-yyyy-MM-dd",
        level: "ERROR",
        maxLogSize: 10485760,
        category: ["cheese", "console", "http"]
      }
    ],
    replaceConsole: true
  });

  app.use(log4js.connectLogger(log4js.getLogger("http"), { level: "auto" }));
  app.use(express.static(path.join(__dirname, "./uploads")));
  app.use(
    session({
      store: new RedisStore({
        ttl: 4 * 60 * 60, // seconds
        client: redisClient,
        logErrors: true
      }),
      secret: "8d31c99f-eb51-477d-b32a-e43792066729",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 4 * 60 * 60 * 1000 } // micro seconds
    })
  );
  app.use(bodyParser.json({ limit: "50mb" }));

  const dest = path.resolve(__dirname, "./uploads/");
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const suffix = file.mimetype.split("/")[1];
      cb(null, `${randomString()}.${suffix}`);
    }
  });
  app.use(multer({ storage, limits: {fileSize: 10485760} }).single("file"));
  app.use((req, res) => {
    const splittedUrlPath = req.url
      .split("?")[0]
      .split("/")
      .slice(1);

    const { action, params } = mapUrl(actions, splittedUrlPath);
    if (action) {
      action(req, params, { io })
        .then(result => {
          if (result instanceof Function) {
            result(res);
          } else {
            res.json(result);
          }
        })
        .catch(reason => {
          const { status, redirect, code, msg } = reason;
          if (status && parseInt(status / 300, 10) === 3 && redirect) {
            res.redirect(redirect);
          } else if (code && msg) {
            log.error("API ERROR:", msg);
            res.json(reason);
          } else if (msg) {
            log.error("API ERROR:", msg);
            res.json({ ...reason, code: 3000 });
          } else {
            log.error(
              "API ERROR:",
              pretty.render(JSON.stringify(reason)),
              reason
            );
            console.error(
              "API ERROR:",
              pretty.render(JSON.stringify(reason)),
              reason
            );
            res
              .status(reason.status || 200)
              .json({ code: 3000, msg: "服务出错！请联系管理员！" });
          }
        });
    } else {
      res.status(404).end("NOT FOUND");
    }
  });

  if (config.apiPort) {
    const runnable = app.listen(config.apiPort, err => {
      if (err) {
        console.error(err);
      }
      log.info("----\n==> 🌎  API is running on port %s", config.apiPort);
      log.info(
        "==> 💻  Send requests to http://%s:%s",
        config.apiHost,
        config.apiPort
      );
    });

    io.on("connection", socket => {
      socket.emit("news", { msg: `'Hello World!' from server` });
      socket.on("msg", data => {
        io.emit("msg", data);
      });
    });
    io.listen(runnable);
  } else {
    console.error(
      "==>     ERROR: No PORT environment variable has been specified"
    );
  }
}

kueCreator().then(() => {
  appLoader();
});
