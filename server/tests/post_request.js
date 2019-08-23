var https = require('https');

var options = {
  'method': 'POST',
  'hostname': 'http://127.0.0.1:3333',
  'path': '/post',
  'headers': {
  }
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

var postData =  "This is expected to be sent back as part of response body.";

req.write(postData);

req.end();