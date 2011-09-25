/**(c) 2011 Enginimation Studio (http://enginimation.com). May be freely distributed under the MIT license.*/
var util = require('util');

exports.initStreams=function(io, streams){
    var i = 0;
    for(; i < streams.length; i++){
        var stream = streams[i];

        util.log('defining stream ' + stream.path);

        (function(stream){
            var channel = io.of(stream.path);
            channel.on('connection', function(socket){
                console.log('connected to channel',stream.path)
                if('counter' === stream.type){
                  socket.on('increment', function(){
                    console.log('message received');
                    stream.impl.increment();
                  });
                  stream.impl.onIncrement(function(counter){
                    socket.emit('updated',{counter: counter});
                  });
                }
            });
        })(stream);
    }
};