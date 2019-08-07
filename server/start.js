const App = require('./app');
const express = require('express');
const fs = require('fs')

let settings = JSON.parse(fs.readFileSync("./settings.json"));
app = new App(express(), settings);
app.init_all();
