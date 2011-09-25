/**(c) 2011 Enginimation Studio (http://enginimation.com). May be freely distributed under the MIT license.*/
/*global Backbone: true, io: true */
// Backbone events: create, read, update, delete

"use strict";
var Streamer = {
  io : window.io,
  methods:{
    CREATE: 'create',
    READ:   'read',
    UPDATE: 'update',
    DELETE: 'delete'
  }
};
//streaming backbone collection. Preconditions: socket.io should be included.
Streamer.Collection = Backbone.Collection.extend({

  //initialize all channels for collection
  initialize: function(){
    var self = this;
    this.channel = Streamer.io.connect(this.url);
    //new model should be added
    this.channel.on('added', function(attributes){
      var modelInstance = new self.model(attributes);
      self.add(modelInstance);
    });
    //model should be removed
    this.channel.on('removed', function(id){
      var modelToRemove = self.get(id);
      if(modelToRemove){
          self.remove([modelToRemove]);
      }
    });
    //model should be updated
    this.channel.on('updated', function(attributes){
      var modelToUpdate=self.get(id);
      if(modelToUpdate){
        modelToUpdate.set(attributes);
      }
    });
    this.channel.on('reset', function(models){
      self.reset(models);
    });
  }
});

Streamer.Model = Backbone.Model.extend({

  //initialize all channels for model
  initialize: function(){
    console.log('initialized called from counter')
    var self = this;
    this.channel = Streamer.io.connect(this.urlRoot);
    //model should be updated
    this.channel.on('updated', function(attributes){
      console.log('updated attr',attributes)
      self.set(attributes);
    });

    //model should be removed
    this.channel.on('removed', function(attributes){
      self.destroy();
    });
  }
});

//Counter model. Listen for the `increment` event on server. Namespace should be urlRoot of this model.
// For updating counter you can create new model or use existing one and call `save`.
Streamer.CounterModel = Streamer.Model.extend({
  sync: function(method, model, options){
    if(Streamer.methods.CREATE === method || Streamer.methods.UPDATE === method){
      console.log('method',method)
      this.channel.emit("increment");
    }
  }
});