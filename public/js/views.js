//all rights reserved. Enginimation Studio, 2011 (http://enginimation.com)
var ui={};
$(function(){
    "use strict";
    ui.AppView = Backbone.View.extend({
        el: 'html',
        pages: $('#content-container article'),
        introPage: $('#intro-page'),

        events:{
            'click #vote-button': 'vote',
            'click a.nav-link': 'clickLink'
        },
        initialize:function(){
            _.bindAll(this,'readStories','createNewStory','readStory','vote','clickLink');
            this.voteCounter=new ui.VoteCounter();
            this.storiesPage=new ui.StoriesPage();
            this.newStoryPage=new ui.NewStoryPage();
            this.storyFullPage=new ui.StoryFullPage();
        },
        clickLink: function(e){
          e.preventDefault();
          var link=$(e.target).attr("href").substring(1)||"/";
          console.log(e,link);
          AppController.router.goto(link);
        },
        vote:function(){
            if(!AppController.settings.isVoted()){
                this.voteCounter.vote.save();
                //AppController.settings.saveVotedStatus()
            }
        },
        showIntro:function(){
            this.$(this.pages).addClass('hidden');
            this.$(this.introPage).removeClass('hidden');
        },
        readStories:function(){
            this.$(this.pages).addClass('hidden');
            this.$(this.storiesPage.el).removeClass('hidden');
        },
        createNewStory:function(){
            this.$(this.pages).addClass('hidden');
            this.$(this.newStoryPage.el).removeClass('hidden');
        },
        readStory:function(story){
            this.$(this.pages).addClass('hidden');
            this.$(this.storyFullPage.el).removeClass('hidden');
            this.storyFullPage.model=story;
            this.storyFullPage.render();
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
                self.editor.activate($(this),{placeholder: 'T-Com is the worst company in the world because ... Start type here to create your story'});//controlsTarget: $('#text-editor-tools')
                self.textCreated=true;
            });
            this.$(this.author).val(AppController.settings.getUser());
        },
        saveStory:function(){
            if(this.textCreated){
                var story=new models.Story(),
                    text=this.editor.content(),
                    author=this.$(this.author).val(),
                    tags=this.$(this.tags).val();
                AppController.settings.saveUser(author);
                story.set({
                    text:text,
                    author:author,
                    tags:tags,
                    date:new Date()
                });
                story.save({
                    success:function(model,resp){
                        console.log('success');
                        AppController.appView.readStory(model);
                    },
                    error:function(model,resp){
                        console.log('error');
                        AppController.appView.readStory(model);
                    }
                });
                AppController.appView.readStories();
            }
            else{
                alert('Please write story');
            }
        }
    });

    ui.VoteCounter=Backbone.View.extend({
        el:$('#people-count'),
        tpl:$('#people-counter-tpl').html(),
        initialize:function(){
            _.bindAll(this,'render');
            this.vote=new models.Vote();
            this.vote.bind('change',this.render);
        },
        render:function(){
            console.log('should rerender',this.vote);
            var digits=this.vote.get('counter')||'0',
                digitsArray = [],
                i = 0;
            for(;i<digits.length;i++){
                digitsArray[i] = digits.charAt(i);
            }
            $(this.el).html(_.template(this.tpl,{digits:digitsArray}));
            return this;
        }
    });

    ui.StoriesPage=Backbone.View.extend({
        el:$('#stories-page'),
        storiesPreviews: $('#stories-previews'),
        initialize:function(){
            _.bindAll(this,'addStory','addStories');
            this.stories=new models.Stories();
            this.stories.bind('add',this.addStory);
            this.stories.bind('reset',this.addStories);
            this.stories.fetch();
        },
        addStory:function(story){
            var storyView=new ui.StoryView({model:story});
            this.$(this.storiesPreviews).append(storyView.render().el)
        },
        addStories:function(){
            this.stories.each(this.addStory);
        }
    });

    ui.StoryView=Backbone.ModelView.extend({
        tagName:'article',
        className:'story-preview',
        tplId:'story-tpl'
    });

    ui.StoryFullPage=Backbone.View.extend({
        el:$('#story-page'),
        header:$("#story-page header"),
        initialize:function(){
            this.contentView=new ui.StoryContent();
        },
        render:function(){
            this.contentView.model=this.model;
            $(this.contentView.el).empty();
            this.contentView.render();
            return this;
        }
    });
    ui.StoryContent=Backbone.ModelView.extend({
        el:$('#story-content'),
        tplId:'story-full-view-tpl'
    });
});