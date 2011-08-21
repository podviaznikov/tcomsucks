var util=require('util'),
    storyStorage=require('./storage/story.storage');

var Stream=Object.create({},{
    entriesStoreName:{
        get:function(){
            return this.name+':all';
        }
    },
    addingEntriesChannelName:{
        get:function(){
            return this.name+':added';
        }
    },
    updatingEntriesChannelName:{
        get:function(){
            return this.name+':updated';
        }
    },
    removingEntriesChannelName:{
        get:function(){
            return this.name+':removed';
        }
    },
    path:{
        get:function(){
            return '/'+this.name;
        }
    }
});
exports.defineStream=function(name,type){
    var stream=Object.create(Stream);
    stream.name=name;
    stream.type=type;
    return stream;
};
exports.initStreams=function(io,streams,redisStreamer){
    var i=0;
    for(;i<streams.length;i++){
        var stream=streams[i];

        util.log('defining to '+stream.path);

        (function(stream){
            io.of(stream.path).on('connection',function(socket){
                util.log('connected to '+stream.path);
                if('couch'===stream.type){
//                    storyStorage.getAll(function(stories){
//                       socket.emit('reset',stories);
//                    });

                    storyStorage.stream(function(story){
                        socket.emit('added',story);
                    });
                }
                else if('redis'===stream.type){
                    redisStreamer.onVote(function(votes){
                        socket.emit('updated',{votes:votes});
                    })
                }
            });
        })(stream);
    }
};