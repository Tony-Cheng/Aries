#!/usr/bin/env node

var express = require('express');
var session = require("express-session");
var bodyParser = require("body-parser")
var LoginSystem = require("./login/login");

module.exports = class {
  constructor(app, root) {
    this.app = app;
    this.root = root;
  }

  init_all() {
    this.init_middleware();
    this.init_static_websites();
    this.init_subpath();
    this.init_modules();
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
    this.app.use('/aries', express.static(this.root + "Aries/website", { extensions: ['html', 'htm'] }));
  }

  init_subpath() {

  }

  init_modules() {
    let loginSystem = new LoginSystem(this.app);
    loginSystem.init_all();
  }
}