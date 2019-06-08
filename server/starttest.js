#!/usr/bin/env node

var path = require('path');
var express = require('express');
var session = require("express-session");
var bodyParser = require("body-parser")
var loginSystem = require("./login/login");
var app = express();
var cors = require('cors')

const port = 3333;

// app.use(session({
//   secret: 'secret',
//   resave: true,
//   saveUninitialized: true
// }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.post("/", (req, res) => {
  console.log('/ POST');
  res.end();
})


app.get("/", (req, res) => {
  console.log('/ GET');
  //Send test file and commented out res.end() to test sending info
  res.sendFile(path.join(__dirname + '/test/test.html'));
  //res.end();
})

// server.tcheng.ca:3333/login
app.post("/login", (req, res) => {
  loginSystem.login(req, res);
})

app.post("/register", (req, res) => {
  console.log("/register POST");
  console.log(req.body.password);
  res.end();
  //loginSystem.register(req, res);
})

app.get("/register", (req, res) => {
  console.log("/register GET");
  res.end();
})

app.post("/test", (req, res) => {
  console.log("????");
  console.log(req.body);
  res.end();
})

app.listen(port, () => console.log(`Proximity app listening on port ${port}!`))