/**(c) 2011 Enginimation Studio (http://enginimation.com). May be freely distributed under the MIT license.*/
/*global Backbone: true, io: true, JSON:true */
"use strict";
//streaming backbone collection. Preconditions: socket.io should be included.
Backbone.StreamingCollection=Backbone.Collection.extend({

    //initialize all channels for collection
    initialize:function(){
        var self=this,
            channel=io.connect(this.url);
        //new model should be added
        channel.on('added',function(attributes){
            var modelInstance=new self.model(attributes);
            self.add(modelInstance);
        });
        //model should be removed
        channel.on('removed',function(id){
            var modelToRemove=self.get(id);
            if(modelToRemove){
                self.remove([modelToRemove]);
            }
        });
        //model should be updated
        channel.on('updated',function(attributes){
            var modelToUpdate=self.get(id);
            if(modelToUpdate){
                modelToUpdate.set(attributes);
            }
        });
        channel.on('reset',function(models){
            self.reset(models);
        });
    }
});