var redis=require('redis'),
    store=redis.createClient(),
    sub=redis.createClient(),
    pub=redis.createClient();


exports.init = function(channelName){
  this.channelName = channelName;
  sub.subscribe(channelName);
  return this;
};

exports.increment = function(){
  store.incr(this.channelName);
  pub.publish(this.channelName, this.channelName);
};

exports.onIncrement = function(callback){
  sub.on('message', function(pattern, key){
    exports.getCounter(callback);
  });
};

exports.getCounter = function(callback){
  store.get(this.channelName, function(err, votes){
    callback(votes);
  });
};

