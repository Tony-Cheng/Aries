#!/usr/bin/env node

var express = require('express')
var app = express()

const port = 3333;

app.get("/", (req, res) => {
  res.send('Received a default request!\n')
})

// server.tcheng.ca:3333/login
app.get("/login", (req, res) => {
  console.log('Proximity app listening on port ${req.username}!')
})

app.get("/register", (req, res) => {
  
})

app.listen(port, () => console.log(`Proximity app listening on port ${port}!`))