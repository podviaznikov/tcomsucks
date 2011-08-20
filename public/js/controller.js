//all rights reserved. Enginimation Studio, 2011 (http://enginimation.com)
"use strict";
var AppController={
    init: function(){
        this.appView=new ui.AppView();
        this.router=new AppRouter();
        Backbone.history.start({pushState: true});
        return this;
    }
};
var AppRouter=Backbone.Router.extend({

  routes:{
    '/stories'         : 'stories',
    '/stories/:story'  : 'story'
  },
  stories:function(){
    A//ppController.appView.readStories();
    console.log('fired')
  },
  story:function(){
    //AppController.router.navigate('/stories',false);
    console.log('story');
  },
});
