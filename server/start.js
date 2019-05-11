#!/usr/bin/env node

var express = require('express');
var session = require("express-session");
var bodyParser = require("body-parser")
var loginSystem = require("./login/login");
var app = express();

const port = 3333;

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send('Received a default request!\n')
})

// server.tcheng.ca:3333/login
app.get("/login", (req, res) => {
  loginSystem.login(req, res);
})

app.get("/register", (req, res) => {
  loginSystem.register(req, res);
})

app.listen(port, () => console.log(`Proximity app listening on port ${port}!`))