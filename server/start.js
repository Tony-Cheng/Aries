#!/usr/bin/env node

var express = require('express');
var session = require("express-session");
var bodyParser = require("body-parser")
var loginSystem = require("./login/login");
var app = express();
const fs = require('fs')
const port = JSON.parse(fs.readFileSync(__dirname + "/setting.json")).port;;

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/", (req, res) => {
  console.log('/ POST');
  res.end();
})

app.get("/", (req, res) => {
  console.log('/ GET');
  res.end();
})

// server.tcheng.ca:3333/login
app.post("/server/login", (req, res) => {
  console.log("/login POST")
  loginSystem.login(req, res);
})

app.post("/server/register", (req, res) => {
  console.log("/register POST");
  loginSystem.register(req, res);
})

app.get("/server/register", (req, res) => {
  console.log("/register GET");
  res.end();
})

app.listen(port, () => console.log(`Proximity app listening on port ${port}!`))