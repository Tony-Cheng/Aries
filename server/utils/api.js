const request = require('request');

exports.isToxic = (url, message) => {
    return new Promise((resolve, reject) => {
        var options = {
            method: 'GET',
            url: url,
            headers:
            {
                'cache-control': 'no-cache',
                Connection: 'keep-alive',
                'Accept-Encoding': 'gzip, deflate',
                'Cache-Control': 'no-cache',
                Accept: '*/*',
                'User-Agent': 'PostmanRuntime/7.15.2',
                'Content-Type': 'text/plain'
            },
            'timeout': 10000,
            body: message,
        };

        request(options, function (error, response, body) {
            if (error) reject(error);
            resolve(body == 'True\n');
        });
    });
}