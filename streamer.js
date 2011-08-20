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
exports.defineStream=function(name){
    var stream=Object.create(Stream);
    stream.name=name;
    return stream;
};
exports.initStreams=function(io,streams){
    var i=0;
    for(;i<streams.length;i++){
        var stream=streams[i];

        util.log('defining to '+stream.path);

        (function(stream){
            io.of(stream.path).on('connection',function(socket){
                util.log('connected to '+stream.path);

                storyStorage.stream(function(story){
                    console.log('story loaded',story);
                    socket.emit('added',story);
                });
            });
        })(stream);
    }
};