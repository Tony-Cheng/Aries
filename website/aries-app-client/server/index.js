const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const loginIO = require('./loginIO');

var IO = new loginIO();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/Login', async (req, res) => {
  var msg = "";
  var username = req.query.username;
  var password = req.query.password;
  if (username && password) { 
      await IO.check(username, password).then().catch((err) => {
      console.log("here");
      msg = err;
    console.log(msg)});  
  }
  console.log("outside"+msg);
  console.log(username);
  console.log(password);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ message: `${msg}` }));
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);