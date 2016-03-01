var http = require('http');
var sonos = require('sonos');
var handler = require('./src/handler');
var server = http.createServer(handler);

server.listen(3000, function() {
    console.log('Listening on port 3000...');
});
