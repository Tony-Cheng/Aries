var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var LoginSystem = require("./login/login");
const MongoClient = require("mongodb").MongoClient;
const mysql = require("mysql");
const path = require("path");
var serverListener = require("./communication/server_listener");
const messagingDB = require("./process_messages/messagingDB");
const scoreSystem = require("./recommendation/score_system");
module.exports = class {
  constructor(app, settings) {
    this.app = app;
    this.settings = settings;
    this.port = settings.port;
  }

  async init_all() {
    await this.init_db_connections();
    this.init_middleware();
    this.init_static_websites();
    this.init_modules();
    this.init_subpath();
    this.init_listener();
    this.init_messenger();
  }

  async init_db_connections() {
    let url = `mongodb://${this.settings.mongo.user}:${this.settings.mongo.password}@${this.settings.mongo.host}:27017/admin`;
    let mongo_con = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.mongo_db = mongo_con.db(this.settings.mongo.database);
    this.mysql_pool = mysql.createPool(this.settings.mysql);
    return;
  }

  init_messenger() {
    //this.app.use('/messenger', proxy('localhost:4000'));
  }

  init_middleware() {
    this.app.use(
      session({
        secret: "secret",
        resave: true,
        saveUninitialized: true
      })
    );

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  init_static_websites() {
    this.app.use(
      "/",
      express.static("./website", { extensions: ["html", "htm"] })
    );
    //this.app.use('/messenger', proxy('localhost:4000'));
    this.app.use(express.static(path.join(__dirname, "build")));
    this.app.get("/messenger", function (req, res) {
      if (req.session.loggedIn === true) {
        res.sendFile(path.join(__dirname, "build", "index.html"));
      } else {
        res.sendFile(path.join(__dirname, "website", "index.html"));
      }
    });
  }

  init_listener() {
    var io = require("socket.io").listen(
      this.app.listen(this.port, () => {
        console.log("The app is listening on port " + this.port);
      })
    );
    var serverSocket = new serverListener(
      io,
      this.messagingDB,
      this.loginSystem,
      this.scoreSystem
    );
    serverSocket.initializeAllListeners();
  }
  init_subpath() {
    this.app.post("/aries/server/register", (req, res) => {
      this.loginSystem.register(req, res);
    });
    this.app.post("/aries/server/login", (req, res) => {
      this.loginSystem.login(req, res);
    });
    this.app.post("/logout", (req, res) => {
      req.session.loggedIn = false;
      req.session.save(function(err){});
    })
  }

  init_modules() {
    this.loginSystem = new LoginSystem(this.mysql_pool);
    this.messagingDB = new messagingDB(
      this.mysql_pool,
      this.mongo_db,
      this.settings.toxicity_api_endpoint
    );
    this.scoreSystem = new scoreSystem(this.mysql_pool);
  }
};
