var util=require('util'),
    redis=require('redis'),
    store=redis.createClient(),
    sub=redis.createClient(),
    pub=redis.createClient(),
    channel='vote';

sub.subscribe(channel);

exports.fireVote=function(){
    store.incr('votes');
    pub.publish(channel,'votes');
};

exports.onVote=function(callback){
    sub.on('message',function(pattern,key){
        getVotes(callback);
    });
};

getVotes=function(callback){
    store.get('votes',function(err,votes){
        callback(votes);
    });
};

exports.getVotes = getVotes;