//all rights reserved. Enginimation Studio, 2011 (http://enginimation.com)
"use strict";
var models={};
models.Story=Backbone.Model.extend({
    urlRoot:'/api/stories',
    idAttribute:'_id',
    defaults:{
        author:''
    },
    initialize:function(attributes){
        if(attributes.date){
            var milliseconds=Date.parse(attributes.date),
                pubDate=new Date(milliseconds);
            this.set({pubDate:pubDate.toDateString()});
        }
        if(attributes.text){
            this.set({shortText:attributes.text.substring(0,50)});
        }
    }});
models.Stories=Backbone.StreamingCollection.extend({
    model:models.Story,
    url:'/api/stories'
});