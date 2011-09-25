var BaseStream = require('../stream.def').BaseStream,
   impl = require('./counter.stream.impl');

var CounterStream = Object.create(BaseStream,{
});

exports.defineCounterStream = function(name){
  var stream = Object.create(CounterStream);
  stream.name = name;
  stream.type = 'counter';
  stream.impl = impl.init(name);
  return stream;
};