#!/usr/bin/env node

var express = require('express')
var app = express()
var example1 = require('./example_import')

const port = 3333;

app.get("/", (req, res) => {
  res.send('Received a default request!\n')
})
app.get("/login", (req, res) => {
  example1.func1(req, res)
})

app.listen(port, () => console.log(`Proximity app listening on port ${port}!`))