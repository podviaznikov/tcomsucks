//all rights reserved. Enginimation Studio, 2011 (http://enginimation.com)
"use strict";
var AppController={
    init: function(){
        this.appView=new ui.AppView();
        this.router=new AppRouter();
        Backbone.history.start({pushState: true,root: '/tcom'});
        return this;
    },
    settings:{
        saveUser:function(user){
            window.localStorage.setItem('user',user);
        },
        getUser:function(){
            return window.localStorage.getItem('user')||'';
        },
        saveVotedStatus:function(){
            window.localStorage.setItem('voted',true);
        },
        isVoted:function(){
            return window.localStorage.getItem('voted')||false;
        }
    }
};
var AppRouter=Backbone.Router.extend({
    routes:{
        '/intro'               : 'intro',
        '/stories'             : 'stories',
        '/stories/:story'      : 'story',
        '/new-story'         : 'newStory',
    },
    intro:function(){
        console.log('intor');
        AppController.appView.showIntro();
    },
    stories:function(){
        AppController.appView.readStories();
    },
    newStory:function(){
        AppController.appView.createNewStory();
    },
    story:function(id){
        var story=new models.Story();
        story.id=id;
        story.fetch({
            success:function(story,resp){
                console.log('done',story);
                AppController.appView.readStory(story);
            },
            error:function(story,resp){
                console.log('error');
            }
        });
    }
});
