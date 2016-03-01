var crypto = require('crypto');
var fs = require('fs');
var http = require('http');
var mime = require('mime');
var Sonos = require('../node_modules/sonos').Sonos;
var config = require('../config');

function handler(request, response) {
    var endpoint = request.url;
    var method = request.method;
    if ((endpoint === '/') && (method === 'GET')) {
        endpoint = '/index.html';
    }

    if (method === 'GET') {
        if (endpoint === 'xxx') {
        }
        else {
            var filepath = __dirname+'/../public'+endpoint;
            fs.readFile(filepath, function(error, file){
                if (error) {
                    response.writeHead(404, {'Content-Type':'text/html'});
                    response.end('404 File Not Found');
                }
                response.writeHead(200, {'Content-Type':mime.lookup(filepath)});
                response.end(file);
            });
        }
    }
    else if (method === 'POST') {
        if (endpoint === '/currenttrack') {
            var s = new Sonos(config.sonos.ip, config.sonos.port);
            // Fetch current track info from Sonos
            s.currentTrack(function (error, track) {
                if (error) {
                    console.log(error);
                    return;
                }

                var artworkPath = '/artwork/'+crypto.createHash('md5').update(track.albumArtURL).digest('hex')+'.jpg';

                fs.exists(__dirname+'/../public'+artworkPath, function(exists) {
                    if (!exists) {
                        // Grab the artwork
                        var file = fs.createWriteStream(__dirname+'/../public'+artworkPath);
                        http.get(track.albumArtURL, function(response) {
                            response.pipe(file);
                            file.on('error', function(error) {
                                console.log(error);
                            });
                        });
                    }
                });

                var info = {
                    album:track.album,
                    artist:track.artist,
                    artwork:artworkPath,
                    duration:{
                        now:track.position,
                        total:track.duration
                    },
                    title:track.title
                };

                response.end(JSON.stringify(info));
            })
        }
    }
    else {
        return;
    }
}

module.exports = handler;
