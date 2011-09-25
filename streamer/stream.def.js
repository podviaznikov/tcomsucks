/**(c) 2011 Enginimation Studio (http://enginimation.com). May be freely distributed under the MIT license.*/
// Every stream has:
// - `name` - name of the stream.
// - `type` - type of teh stream.
// - `path` - path to teh stream. Path equals to `name` prefixed with `/`.
var BaseStream = Object.create({},{
  path: {
    get: function(){
      return '/' + this.name;
    }
  }
});

var CollectionStream = Object.create(BaseStream, {
  entriesStoreName: {
    get: function(){
      return this.name + ':all';
    }
  },
  addingEntriesChannelName: {
    get: function(){
      return this.name + ':added';
    }
  },
  updatingEntriesChannelName: {
    get: function(){
      return this.name + ':updated';
    }
  },
  removingEntriesChannelName: {
    get: function(){
      return this.name + ':removed';
    }
  }
});

exports.BaseStream = BaseStream;