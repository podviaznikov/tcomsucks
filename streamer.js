var util = require('util');

exports.initStreams=function(io, streams, redisStreamer){
    var i = 0;
    for(;i<streams.length;i++){
        var stream=streams[i];

        util.log('defining stream '+stream.path);

        (function(stream){
            var channel = io.of(stream.path);
            channel.on('connection',function(socket){
                console.log('connected to channel',stream.path)
                socket.on('increment',function(){
                  console.log('message received');
                  redisStreamer.fireVote();
                });
                util.log('connected to '+stream.path);
                if('redis'===stream.type){
                    redisStreamer.onVote(function(votes){
                        socket.emit('updated',{votes:votes});
                    })
                }
            });
        })(stream);
    }
};