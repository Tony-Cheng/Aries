#!/usr/bin/env node

var express = require('express');
var session = require("express-session");
var bodyParser = require("body-parser")
var loginSystem = require("./login/login");

module.exports = class {
  constructor(app, root) {
    this.app = app;
    this.root = root;
  }

  init_all() {
    this.init_middleware();
    this.init_static_websites();
    this.init_subpath();
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
    this.app.use('/aries', express.static(this.root + "Aries/website"));
  }

  init_subpath() {
    this.app.post("/", (req, res) => {
      console.log('/ POST');
      res.end();
    })

    this.app.get("/", (req, res) => {
      console.log('/ GET');
      res.end();
    })
    this.app.post("/server/login", (req, res) => {
      console.log("/login POST")
      loginSystem.login(req, res);
    })

    this.app.post("/server/register", (req, res) => {
      console.log("/register POST");
      loginSystem.register(req, res);
    })

    this.app.get("/server/register", (req, res) => {
      console.log("/register GET");
      res.end();
    })
  }
}