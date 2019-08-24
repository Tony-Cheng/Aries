#!/usr/bin/env node

var express = require('express');
var session = require("express-session");
var bodyParser = require("body-parser")
var LoginSystem = require("./login/login");
var proxy = require('express-http-proxy');
const path = require('path');

module.exports = class {
  constructor(app, settings) {
    this.app = app;
    this.port = settings.port;
    this.mysql_settings = settings.mysql;
  }

  init_all() {
    this.init_middleware();
    this.init_static_websites();
    this.init_subpath();
    this.init_modules();
    this.init_listener();
    this.init_messenger();
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
	this.app.get('/messenger', function(req, res) {
		res.sendFile(path.join(__dirname, 'build', 'index.html'));
	});
	this.app.post('/messenger', function(res, req) {
		console.log("HOLY SHIT");
	});
  }

  init_listener() {
    var io = require('socket.io').listen(this.app.listen(this.port, () => {
        console.log('The app is listening on port ' + this.port);
    }));
    io.on('connection', (socket) => {
      //Current sample socket event before querying database
      socket.on('newMessage', function (msg) {
        console.log("userid: " + msg.userid + " message: " + msg.text);
        io.to(socket.id).emit('receiveMessage', msg.text);
      });
    });
    /*
   this.app.listen(this.port, () => {
    console.log('The app is listening on port ' + this.port);
    });
    */

}
  init_subpath() {

  }

  init_modules() {
    let loginSystem = new LoginSystem(this.app, this.mysql_settings);
    loginSystem.init_all();
  }
}