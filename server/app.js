#!/usr/bin/env node

var express = require('express');
var session = require("express-session");
var bodyParser = require("body-parser")
var LoginSystem = require("./login/login");
var proxy = require('express-http-proxy');

module.exports = class {
  constructor(app, settings) {
    this.app = app;
    this.port = settings.port;
    this.mysql_settings = settings.mysql;
    this.mysql_settings["database"] = "Aries";
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
    this.app.use('/messenger', proxy('localhost:4000'));
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
    this.app.use('/messenger', proxy('localhost:4000'));
  }

  init_listener() {
    this.app.listen(this.port, () => {
        console.log('The app is listening on port ' + this.port);
    });
}
  init_subpath() {

  }

  init_modules() {
    let loginSystem = new LoginSystem(this.app, this.mysql_settings);
    loginSystem.init_all();
  }
}