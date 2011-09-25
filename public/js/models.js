//all rights reserved. Enginimation Studio, 2011 (http://enginimation.com)
"use strict";
var models={};
models.Story=Backbone.Model.extend({
    urlRoot:'/api/stories',
    idAttribute:'_id',
    defaults:{
        author:'anonymous',
        shortText:'',
        date: new Date().toString()
    },
    initialize:function(attributes){
        if(attributes.date){
            var milliseconds=Date.parse(attributes.date),
                pubDate=new Date(milliseconds);
            this.set({pubDate:pubDate.toDateString()});
        }
        if(attributes.text){
            var lines=attributes.text.split('<br>');
            if(lines.length===1){
                this.set({shortText:lines[0].substring(0,50)});
            }
            else if(lines.length>1){
                var threeLines = lines.slice(0,2);
                this.set({shortText:threeLines.join('<br>').substring(0,50)});
            }
            else{
                this.set({shortText:''});
            }
        }
    }
});
models.Stories=Streamer.Collection.extend({
    model:models.Story,
    url:'/stories'
});

models.Vote=Streamer.CounterModel.extend({
  urlRoot:'/votes'
});
