#!/usr/bin/env node

const http = require('http');
var express = require('express')
var app = express()

const hostname = '0.0.0.0';
const port = 3333;

app.get("/", (req, res) => {
  res.send('Received a default request!\n')
})
app.get("/login", (req, res) => {
  res.send('Received a login request!\n')
})

app.listen(port, () => console.log(`Proximity app listening on port ${port}!`))