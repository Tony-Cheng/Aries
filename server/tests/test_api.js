var express = require('express');
var settings = require('../test_settings.json');
const messaging_service = require('../process_messages/messaging_service');

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

var messagingService = new messaging_service(settings);

messagingService.send_message('test sending a message', 1, 2);
messagingService.send_message('go to hell', 2, 2);