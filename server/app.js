var express = require('express');
var session = require("express-session");
var bodyParser = require("body-parser")
var LoginSystem = require("./login/login");
const MongoClient = require('mongodb').MongoClient;
const mysql = require('mysql');
const path = require('path');
var serverListener = require('./server_listener');

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
    this.mysql_con = mysql.createConnection(this.settings.mysql);
    await this.mysql_con.connect();
    return;
  }

  init_messenger() {
    //this.app.use('/messenger', proxy('localhost:4000'));
  }

  init_middleware() {
    this.app.use(session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    }));

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  init_static_websites() {
    this.app.use('/', express.static("./website", { extensions: ['html', 'htm'] }));
    //this.app.use('/messenger', proxy('localhost:4000'));
    this.app.use(express.static(path.join(__dirname, 'build')));
    this.app.get('/messenger', function (req, res) {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
  }

  init_listener() {
    var io = require('socket.io').listen(this.app.listen(this.port, () => {
      console.log('The app is listening on port ' + this.port);
    }));
    var serverSocket = new serverListener(io);
    serverSocket.initializeAllListeners();
    /*
    io.on('connection', (socket) => {
      //Current sample socket event before querying database
      socket.on('newMessage', function (msg) {
        console.log("userid: " + msg.userid + " message: " + msg.text);
        io.to(socket.id).emit('receiveMessage', msg.text);
      });
    });
    */
    /*
   this.app.listen(this.port, () => {
    console.log('The app is listening on port ' + this.port);
    });
    */

  }
  init_subpath() {
    this.app.post("/aries/server/register", (req, res) => {
      this.loginSystem.register(req, res);
    });
    this.app.post("/aries/server/login", (req, res) => {
      this.loginSystem.login(req, res);
    });
  }

  init_modules() {
    this.loginSystem = new LoginSystem(this.mysql_con);
  }
}