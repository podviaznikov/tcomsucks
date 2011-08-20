//all rights reserved. Enginimation Studio, 2011 (http://enginimation.com)
var ui={};
$(function(){
    "use strict";
    ui.AppView = Backbone.View.extend({
        el: 'html',
        pages: $('#content-container article'),
        introPage: $('#intro-page'),

        events:{
            'click #read-stories'     : 'readStories',
            'click #new-story-button' : 'createNewStory',
        },
        initialize:function(){
            _.bindAll(this,'readStories','createNewStory');
            this.storiesPage=new ui.StoriesPage();
            this.newStoryPage=new ui.NewStoryPage();
        },
        readStories:function(){
            AppController.router.navigate('/stories',false);
            this.$(this.pages).addClass('hidden');
            this.$(this.storiesPage.el).removeClass('hidden');
        },
        createNewStory:function(){
            this.$(this.pages).addClass('hidden');
            this.$(this.newStoryPage.el).removeClass('hidden');
        }
    });

    ui.NewStoryPage=Backbone.View.extend({
        el:$('#new-story-page'),
        author:$('#new-story-author'),
        tags:$('new-story-tags'),
        events:{
            'click #save-story-button' : 'saveStory'
        },
        initialize:function(){
            _.bindAll(this,'saveStory');
            var self=this;
            this.editor=new Proper();
            $('.content').click(function(){
                self.editor.activate($(this),{placeholder: 'T-Com is the worst company in the world because ... Start type here to create your story'});
                self.textCreated=true;
            });
        },
        saveStory:function(){
            if(this.textCreated){
                var story=new models.Story(),
                    text=this.editor.content(),
                    author=this.$(this.author).val(),
                    tags=this.$(this.tags).val();
                console.log('text',this.editor.content());
                story.set({
                    text:text,
                    author:author,
                    tags:tags,
                    date:new Date()
                });
                console.log('saving story',story);
                story.save();
            }
            else{
                alert('empty');
            }
        }
    });

    ui.StoriesPage=Backbone.View.extend({
        el:$('#stories-page'),
        storiesPreviews:$('#stories-previews'),
        initialize:function(){
            _.bindAll(this,'addStory');
            this.stories=new models.Stories();
            this.stories.bind('add',this.addStory);
        },
        addStory:function(story){
            console.log(story);
            var storyView=new ui.StoryView({model:story});
            this.$(this.storiesPreviews).append(storyView.render().el)
        }
    });

    ui.StoryView=Backbone.ModelView.extend({
        tagName: 'article',
        className:'story-preview',
        tplId:'story-tpl'
    });
});